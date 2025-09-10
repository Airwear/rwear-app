import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, AuthDataType } from '@/utils/type-def';
import { _post, _put, apiRoutes } from '@/services/api';
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

    setLoading(true)
    
    return _post(apiRoutes.login, {email, password}, controller)
      .then(response => {

        const {data, error, message} = response
        isLogged(false)

        if(error) {
          setError(message);

        } else {

          console.log('_data', data)

          setAuthData(data);
  
          AsyncStorage.setItem(AuthStorageKey, JSON.stringify(data))
  
          isLogged(true)
        }

      })
      .catch(error => {
        console.log('error', error.message)
        isLogged(false)
      })
      .finally(() => setLoading(false))
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

    setLoading(true)

  
    setTimeout(async () => {

      await AsyncStorage.setItem(AuthStorageKey, '')

      //Remove data from context, so the App can be notified
      //and send the user to the AuthStack
      setAuthData(undefined);

      isLogged(false)

      setLoading(false)

    }, 2000)

  };

  const setUrl = async (url: string) => {
    setBaseUrl(url)
  }

  const register = async (email: string, login: string, password: string, fbm_token: string) => {

    setRegistering(true)
    setError('')

    return _post(apiRoutes.register, {email, username: login, password, fbm_token, group_id: 1}, controller)
      .then(response => {

        const {user, error, message} = response
        
        if (error) {
          setError(message)
        } else {
          const data = response.data;
          if(data) {
            AsyncStorage.setItem(AuthStorageKey, JSON.stringify(data))
            setAuthData(data);
            isLogged(true)
            
            loadStorageData()
          }
        }

        console.log('register', response)
      })
      .catch(error => {
        console.log('error', error)
      })
      .finally(() => setRegistering(false))
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
