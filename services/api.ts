import axios from "axios"

// Domaine API principal (modifiable via variable d'environnement Expo)
const defaultApiHost = 'https://rwear-sport.octet-group.org/api';
// Domaine web (pages, policy, CGU, map) – ajuster si nécessaire
const baseRoute: string = 'https://optikar.octet-group.org';

// Construire correctement les URLs (avant il y avait une concat invalide)
const URL_POLICY = 'https://rwear-sport.octet-group.org/policy';
const URL_CGU = 'https://rwear-sport.octet-group.org/cgu';
const URL_MAP = baseRoute + '/map';

const apiRoutes = {
    login: '/users/login',
    register: '/users/register',
    editUser: '/users',
    me: '/users/me',
    resendVerification: '/users/resend-verification',
    passwordResetRawUrl: baseRoute + '/password/reset',

    vehicles: '/vehicles',
    interventions: '/interventions',
    trainings: '/trainings',
    policies: baseRoute + '/policies',
    map: baseRoute + '/map',
    URL_POLICY,
    URL_CGU
}

const webRoutes = {
    URL_PASSWORD_RESET: baseRoute + '/password/reset',
    URL_POLICY,
    URL_CGU,
    URL_MAP
}

// BaseURL dynamique: priorise EXPO_PUBLIC_API_URL sinon fallback sur defaultApiHost
const resolvedBaseURL = process.env.EXPO_PUBLIC_API_URL || defaultApiHost;

const axiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // léger allongement pour connexions lentes
});

// Permet de mettre à jour le token après authentification
function setAuthToken(token?: string) {
  if (token) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.Authorization;
  }
}

// Intercepteur requêtes (log limité au mode dev)
axiosInstance.interceptors.request.use(
  config => {
    if (__DEV__) {
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      console.log('[API][REQ]', config.method?.toUpperCase(), fullUrl);
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => {
    if (__DEV__) {
      console.log('[API][RES]', response.status, response.config.url);
    }
    return response;
  },
  error => {
    let extractedMessage = 'Erreur réseau';
    if (error.response) {
      extractedMessage = error.response.data?.message || `HTTP ${error.response.status}`;
      if (__DEV__) console.error('[API][ERR][RESP]', error.response.status, extractedMessage);
    } else if (error.request) {
      if (__DEV__) console.error('[API][ERR][NO_RESP]', error.message);
      extractedMessage = 'Serveur injoignable';
    } else {
      if (__DEV__) console.error('[API][ERR][CONF]', error.message);
      extractedMessage = error.message;
    }
    // Attache un message propre pour le catch
    (error as any).friendlyMessage = extractedMessage;
    return Promise.reject(error);
  }
);



function _post(path: string, data: any, controller: AbortController, headers: any = {}) {
  if (__DEV__) console.log('[API][_POST]', path, data);
  return axiosInstance
    .post(path, data, {
      signal: controller?.signal,
      ...headers,
    })
    .then(response => response.data);
}

function _put(path: string, data: any, controller: AbortController, headers: any = {}) {
  if (__DEV__) {
    console.log('[API][_PUT]', path);
    console.log('[API][_PUT][DATA]', data);
  }
  return axiosInstance
    .put(path, data, {
      signal: controller?.signal,
      ...headers,
    })
    .then(response => response.data);
}

function _get(path: string, controller: AbortController, headers: any = {}) {
  if (__DEV__) console.log('[API][_GET]', path);
  return axiosInstance
    .get(path, {
      ...headers,
      signal: controller?.signal,
    })
    .then(response => response.data);
}

// Vérifie rapidement l'accessibilité du backend (renvoie true/false)
async function pingBackend(): Promise<boolean> {
  try {
    // On tente juste une requête GET sur / (selon API peut renvoyer 404 mais accessible)
    await axiosInstance.get('/');
    return true;
  } catch (e) {
    return false;
  }
}

export {
  _post,
  _get,
  _put,
  apiRoutes,
  webRoutes,
  setAuthToken,
  resolvedBaseURL,
  pingBackend,
}
