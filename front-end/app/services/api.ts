import axios from "axios"

const host = 'https://rwear-sport.octet-group.org/api';
const baseRoute : string = 'https://optikar.octet-group.org';

const URL_POLICY = baseRoute + "https://rwear-sport.octet-group.org/policy"
const URL_CGU = baseRoute + "https://rwear-sport.octet-group.org/cgu"
const URL_MAP = baseRoute + "/map"

const apiRoutes = {
    login: '/users/login',
    register: '/users/register',
    editUser: '/users',
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

const axiosInstance = axios.create({
    baseURL: host,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // temps limite pour les requêtes (en ms)
});

// Gestion des requêtes et des réponses
axiosInstance.interceptors.request.use(
    config => {
      // Ajoute des configurations supplémentaires si nécessaire
      // Par exemple, ajouter un token d'authentification
      const token = "MY APP TOKEN HERE";
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      const fullUrl = `${config.baseURL}${config.url}`;

      console.log('Full URL:', fullUrl);

      return config;
    },
    error => {
      return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
      // Gère les réponses avec succès
      return response;
    },
    error => {
      // Gère les erreurs de réponse
      if (error.response) {
        // Le serveur a répondu avec un statut différent de 2xx
        console.error('Error Response:', error.response);
      } else if (error.request) {
        // La requête a été envoyée mais aucune réponse n'a été reçue
        console.error('Error Request:', error.request);
      } else {
        // Quelque chose s'est passé lors de la configuration de la requête
        console.error('Error Message:', error.message);
      }

      return Promise.reject(error);
    }
  );



function _post(path: string, data: any, controller: AbortController, headers: any = {}) {

    console.log('with data', data)

    return axiosInstance
        .post(path, data, {
            signal : controller?.signal,
                ...headers
        })
        .then(response => response.data)
}

function _put(path: string, data: any, controller: AbortController, headers: any = {}) {

    console.log('remote PUT:', path)
    console.log('with data', data)

    return axiosInstance
        .put(path, data, {
            signal : controller?.signal,
            ...headers
        })
        .then(response => response.data)
}

function _get(path: string,  controller: AbortController, headers: any = {}) {
    console.log('remote GET:', path)
    return axiosInstance
        .get(path,  {
            ...headers,
            signal: controller?.signal,
        })
        .then(response => response.data)
}

export {
    _post,
    _get,
    _put,
    apiRoutes,
    webRoutes,
}
