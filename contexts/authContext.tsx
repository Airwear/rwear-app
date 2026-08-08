import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthDataType } from '@/utils/type-def';
import axios from 'axios';
import { _post, _put, _get, apiRoutes, setAuthToken, resolvedBaseURL, axiosInstance } from '@/services/api';
import { Loader } from '@/components';

//Create the Auth Context with the data type specified
//and  empty object
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthStorageKey = '@baseapp'
const LastActivityStorageKey = '@lastActivityAt'
const InactivityTimeoutMs = 30 * 60 * 1000;

function resolveEmailVerified(payload: any): boolean {
  if (!payload) return false;

  const rawVerified = payload?.email_verified ?? payload?.user?.email_verified;
  if (typeof rawVerified === 'boolean') return rawVerified;
  if (rawVerified === 1 || rawVerified === '1' || rawVerified === 'true') return true;
  if (rawVerified === 0 || rawVerified === '0' || rawVerified === 'false') return false;

  const verifiedAt = payload?.email_verified_at ?? payload?.user?.email_verified_at;
  if (verifiedAt !== undefined && verifiedAt !== null && verifiedAt !== '') {
    return true;
  }

  // Si l'API ne renvoie pas explicitement l'état de vérification,
  // on n'empêche pas l'accès à l'application après connexion réussie.
  return true;
}

function toSafeUserError(error: any, fallback = 'Une erreur est survenue.') {
  const raw = typeof error === 'string'
    ? error
    : error?.response?.data?.message || error?.friendlyMessage || error?.message || fallback;

  const text = String(raw || fallback).trim();
  const lower = text.toLowerCase();

  if (!text || lower === 'undefined' || lower.includes('no query results for model')) {
    return 'Impossible de charger ou mettre à jour votre profil. Merci de vous reconnecter.';
  }

  return text;
}

// @ts-ignore
const AuthProvider: React.FC = (props: React.PropsWithChildren): any => {

  const [authData, setAuthData] = useState<AuthDataType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [refreshingSession, setRefreshingSession] = useState<boolean>(false);
  const [logged, isLogged] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>();
  const lastActivityWriteRef = React.useRef<number>(0);

  const touchActivity = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastActivityWriteRef.current < 60_000) {
      return;
    }
    lastActivityWriteRef.current = now;
    await AsyncStorage.setItem(LastActivityStorageKey, String(now));
  };

  // Ajout pour gestion du refresh token
  const RefreshTokenStorageKey = '@refreshToken';

  // Fonction pour rafraîchir le token d'accès
  const refreshToken = async () => {
    const refreshToken = await AsyncStorage.getItem(RefreshTokenStorageKey);
    if (!refreshToken) return false;
    setRefreshingSession(true);
    try {
      // À adapter selon ton endpoint de refresh
      const response = await _post('/users/refresh', { refresh_token: refreshToken }, controller);
      const { access_token, refresh_token: newRefreshToken, ...rest } = response.data || response;
      if (access_token) {
        setAuthToken(access_token);
        const nextAuthData = { ...(authData || {}), token: access_token, ...rest };
        setAuthData(nextAuthData);
        await AsyncStorage.setItem(AuthStorageKey, JSON.stringify(nextAuthData));
        if (newRefreshToken) await AsyncStorage.setItem(RefreshTokenStorageKey, newRefreshToken);
        return true;
      }
    } catch (e) {
      return false;
    } finally {
      setRefreshingSession(false);
    }
    return false;
  };

  // Intercepteur global pour gérer les erreurs 401 et tenter un refresh automatique
  React.useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      response => {
        if (logged) {
          touchActivity().catch(() => {});
        }
        return response;
      },
      async error => {
        const originalRequest = error.config;
        const requestUrl = String(originalRequest?.url || '');
        const isRefreshCall = requestUrl.includes('/users/refresh');
        const isSignInCall = requestUrl.includes('/users/login') || requestUrl.includes('/login') || requestUrl.includes('/auth/login');
        const isRegisterCall = requestUrl.includes('/users/register');
        const isPublicAuthCall = isSignInCall || isRegisterCall;

        if (error.response && error.response.status === 401 && !originalRequest?._retry && !isRefreshCall && !isPublicAuthCall) {
          // N'affiche jamais "Session expirée" tant qu'il n'y a pas de session active.
          if (!logged && !authData) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;
          const refreshed = await refreshToken();
          if (refreshed) {
            await touchActivity(true);
            const authHeader = axiosInstance.defaults.headers.Authorization;
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              ...(authHeader ? { Authorization: authHeader as string } : {}),
            };
            return axiosInstance(originalRequest);
          } else {
            const lastActivityRaw = await AsyncStorage.getItem(LastActivityStorageKey);
            const lastActivityAt = Number(lastActivityRaw || '0');
            const inactiveTooLong = lastActivityAt > 0 && (Date.now() - lastActivityAt >= InactivityTimeoutMs);

            if (inactiveTooLong) {
              setError('Session expirée, veuillez vous reconnecter.');
            }
            await signOut();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [authData, logged]);

  const controller = React.useMemo(() => new AbortController(), []);


  useEffect(() => {
    // Every time the provider mounts, load persisted auth state.
    loadStorageData();

    return () => controller.abort();
  }, []);

  async function loadStorageData(): Promise<void> {

    try {

      setLoading(true);

      const authDataSerialized = await AsyncStorage.getItem(AuthStorageKey);

      if (authDataSerialized !== null) {
        //If there are data, it's converted to an Object and the state is updated.
        const _authData: any = JSON.parse(authDataSerialized as any);

        setAuthData(_authData);
        // Injecte le token sauvegardé s'il existe
        setAuthToken(_authData?.token || _authData?.access_token || _authData?.jwt || _authData?.bearer || _authData?.user?.token);
        isLogged(true);
        setEmailVerified(resolveEmailVerified(_authData));
        await touchActivity(true);

        //console.log('AuthContext@loadStorageData_', _authData)
        //console.log('AuthContext@isLogged', logged)

      } else {
        setAuthData(undefined);
        setAuthToken(undefined);
        isLogged(false);
        setEmailVerified(false);
      }
    } catch (error) {

    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    setMessage('');

    const attempt = async (path: string) => {
      if (__DEV__) console.log('[AUTH][LOGIN][ATTEMPT]', path);
      return _post(path, { email, password }, controller);
    };

    const endpoints = [apiRoutes.login, '/login', '/auth/login'];
    let finalResponse: any = null;
    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        finalResponse = await attempt(ep);
        if (finalResponse) break;
      } catch (e: any) {
        lastError = e;
        // si 404 on continue sur endpoint suivant, sinon on arrête
        const status = e?.response?.status;
        if (__DEV__) console.warn('[AUTH][LOGIN][FAIL]', ep, status, e?.friendlyMessage || e?.message);
        if (status && status !== 404) break;
      }
    }

    isLogged(false);

    if (!finalResponse) {
      const status = lastError?.response?.status;
      const rawData = lastError?.response?.data;
      const diagnostic = `Échec connexion${status ? ' (HTTP '+status+')' : ''}`;
      const serverMsg = rawData?.message || rawData?.error || lastError?.friendlyMessage || lastError?.message;
      setError(serverMsg ? `${diagnostic}: ${serverMsg}` : diagnostic);
      setLoading(false);
      return;
    }

    if (__DEV__) console.log('[AUTH][LOGIN][RAW]', JSON.stringify(finalResponse, null, 2));

    const { data, error, message } = finalResponse;

    if (error) {
      setError(message || 'Identifiants invalides');
      setLoading(false);
      return;
    }

    const userData = data || finalResponse;
    const token = userData?.token || userData?.access_token || userData?.jwt || userData?.bearer || userData?.user?.token;

    if (token) {
      setAuthToken(token);
      await touchActivity(true);
    } else if (__DEV__) {
      console.warn('[AUTH][LOGIN] Token manquant – utilisateur tout de même stocké');
    }

    // Stocke aussi le refresh token si présent
    if (userData.refresh_token) {
      await AsyncStorage.setItem(RefreshTokenStorageKey, userData.refresh_token);
    }

    setAuthData(userData);
    AsyncStorage.setItem(AuthStorageKey, JSON.stringify(userData));
    isLogged(true);
    setEmailVerified(resolveEmailVerified(userData));
    setLoading(false);
  };

  const update = async (data: AuthDataType) => {

    const userSlug = data?.slug || authData?.slug || (authData as any)?.user?.slug;

    if (!userSlug || userSlug === 'undefined') {
      setError('Impossible de mettre à jour le profil : identifiant utilisateur manquant.');
      return null;
    }

    setUpdating(true);
    setError('');
    setMessage('');

    try {
      const response = await _put(apiRoutes.editUser + '/' + userSlug, {...data, slug: userSlug}, controller);
      const { message, data: updatedData, error } = response || {};

      if (error) {
        setError(toSafeUserError(message, 'Impossible de mettre à jour le profil pour le moment.'));
        return null;
      }

      const nextAuthData = updatedData || { ...(authData as any), ...data, slug: userSlug };
      setMessage((message && String(message).trim() && String(message).trim() !== 'undefined') ? String(message) : 'Profil mis à jour.');
      setAuthData(nextAuthData);
      await AsyncStorage.setItem(AuthStorageKey, JSON.stringify(nextAuthData));
      return nextAuthData;
    } catch (error) {
      setError(toSafeUserError(error, 'Impossible de mettre à jour le profil pour le moment.'));
      return null;
    } finally {
      setUpdating(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setTimeout(async () => {
      await AsyncStorage.removeItem(AuthStorageKey);
      await AsyncStorage.removeItem(LastActivityStorageKey);
      setAuthToken(undefined);
      setAuthData(undefined);
      isLogged(false);
      setEmailVerified(false);
      setLoading(false);
    }, 500);
  };

  const setUrl = async (url: string) => {
    setBaseUrl(url)
  }

  const resendVerificationEmail = async () => {
    setError('');
    setMessage('');
    try {
      const response = await _post(apiRoutes.resendVerification, {}, controller);
      const { error: resErr, message: resMsg } = response;
      if (resErr) {
        setError(resMsg || 'Erreur lors du renvoi.');
      } else {
        setMessage(resMsg || 'Email de vérification envoyé.');
      }
    } catch (e: any) {
      setError(e?.friendlyMessage || e?.message || 'Erreur réseau');
    }
  };

  const refreshUserData = async (): Promise<boolean> => {
    try {
      const response = await _get(apiRoutes.me, controller);
      const userData = response?.data || response;
      if (userData) {
        const verified = resolveEmailVerified(userData);
        setAuthData(userData);
        setEmailVerified(verified);
        AsyncStorage.setItem(AuthStorageKey, JSON.stringify(userData));
        return verified;
      }
    } catch (e: any) {
      if (__DEV__) console.warn('[AUTH][REFRESH_ME]', e?.message);
    }
    return false;
  };

  const register = async (email: string, login: string, password: string, fbm_token: string = '', extras: Record<string, any> = {}) => {
    setRegistering(true);
    setError('');
    setMessage('');

    return _post(apiRoutes.register, { email, username: login, password, fbm_token, group_id: 1, ...extras }, controller)
      .then(response => {
        const { error, message } = response;
        if (error) {
          setError(message || 'Erreur inscription');
        } else {
          const data = response.data;
          if (data) {
            // On NE connecte PAS automatiquement: on stocke juste email pour préremplir
            AsyncStorage.setItem('@lastRegisteredEmail', email);
            setMessage('Compte créé. Veuillez vous connecter.');
            // Nettoyage éventuel du contexte d auth si quelque chose a été mis
            setAuthData(undefined);
            isLogged(false);
          }
        }
      })
      .catch(error => {
        const friendly = (error as any).friendlyMessage || error.message || 'Erreur réseau';
        setError(friendly);
      })
      .finally(() => setRegistering(false));
  };

  const deleteAccount = async () => {
    const authAny = authData as any;
    const token = authAny?.token || authAny?.access_token || authAny?.jwt || authAny?.bearer || authAny?.user?.token;
    const userRef = authData?.slug || authData?.id;
    const endpoints = [
      userRef ? `/users/${userRef}` : undefined,
      '/users/me',
      '/user',
      '/api/users/me',
      '/api/user',
    ].filter(Boolean) as string[];

    let lastError: any = null;

    for (const endpoint of endpoints) {
      try {
        await axios.delete(`${resolvedBaseURL}${endpoint}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        await signOut();
        return;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        if (status && status !== 404) break;
      }
    }

    const serverMsg = lastError?.response?.data?.message || lastError?.message || 'Erreur suppression du compte';
    setError(serverMsg);
    throw lastError || new Error(serverMsg);
  };

  if(loading || refreshingSession) {
    return <Loader visible />
  }

  return (
    <AuthContext.Provider value={{authData, signIn, update, deleteAccount, signOut, loading, logged, emailVerified, register, error, message, updating, registering, setUrl, baseUrl, resendVerificationEmail, refreshUserData}}>
      {props.children}
    </AuthContext.Provider>
  );
};

// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextType {

  const context = useContext(AuthContext);
  

  if (! context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}


export {AuthContext, AuthProvider, useAuth };
