import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthDataType } from '@/utils/type-def';
import { _post, _put, apiRoutes, setAuthToken } from '@/services/api';
import { Loader } from '@/components';

//Create the Auth Context with the data type specified
//and  empty object
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthStorageKey = '@baseapp'

// @ts-ignore
const AuthProvider: React.FC = (props: React.PropsWithChildren): any => {

  const [authData, setAuthData] = useState<AuthDataType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [logged, isLogged] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>();

  const controller = new AbortController


  useEffect(() => {

    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();

    return () => controller.abort()
    
  }, [logged]);

  async function loadStorageData(): Promise<void> {

    try {

      setLoading(true);

      //Try retrieving the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem(AuthStorageKey);

      if (authDataSerialized !== null) {
        //If there are data, it's converted to an Object and the state is updated.
        const _authData: any = JSON.parse(authDataSerialized as any);

        setAuthData(_authData);
        // Injecte le token sauvegardé s'il existe
        setAuthToken(_authData?.token || _authData?.access_token || _authData?.jwt || _authData?.bearer || _authData?.user?.token);
        isLogged(true);

        //console.log('AuthContext@loadStorageData_', _authData)
        //console.log('AuthContext@isLogged', logged)

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
    } else if (__DEV__) {
      console.warn('[AUTH][LOGIN] Token manquant – utilisateur tout de même stocké');
    }

    setAuthData(userData);
    AsyncStorage.setItem(AuthStorageKey, JSON.stringify(userData));
    isLogged(true);
    setLoading(false);
  };

  const update = async (data: AuthDataType) => {

    setUpdating(true);

    setError('');

    setMessage('');

    console.log('data', data)

    _put(apiRoutes.editUser + '/' + data.slug, {...data}, controller)
        .then(response => {
          
          const {message, data, error} = response;
          
          if(error) {
            setError(message)
          } else {

            setMessage(message);
            setAuthData(data);

            AsyncStorage.setItem(AuthStorageKey, JSON.stringify(data));

          }
        })
        .catch(error => setError(error.response.data.message as string))
        .finally(() => setUpdating(false))
  };

  const signOut = async () => {
    setLoading(true);
    setTimeout(async () => {
      await AsyncStorage.setItem(AuthStorageKey, '');
      setAuthToken(undefined);
      setAuthData(undefined);
      isLogged(false);
      setLoading(false);
    }, 500);
  };

  const setUrl = async (url: string) => {
    setBaseUrl(url)
  }

  const register = async (email: string, login: string, password: string, fbm_token: string = '') => {
    setRegistering(true);
    setError('');
    setMessage('');

    return _post(apiRoutes.register, { email, username: login, password, fbm_token, group_id: 1 }, controller)
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

  if(loading) {
    return <Loader visible />
  }

  return (
    <AuthContext.Provider value={{authData, signIn, update, signOut, loading, logged, register, error, message, updating, registering, setUrl, baseUrl}}>
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
