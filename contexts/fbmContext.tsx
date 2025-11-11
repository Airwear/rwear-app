import {createContext, useContext, useEffect, useRef, useState} from 'react';
import { ExpoNotificationType } from '@/utils/type-def';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
handleNotification: async () => {
    return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    };
},
});

async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  
  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }
  
  async function registerForPushNotificationsAsync() {
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
  
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
  
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  
      if (! projectId) {
        handleRegistrationError('Project ID not found');
      }
  
      try {
  
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
  
        //console.log('fbmContext', pushTokenString);
  
        return pushTokenString;
  
      } catch (e: unknown) {
  
        handleRegistrationError(`${e}`);
  
      }
  
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }



const FBMessageContext = createContext<ExpoNotificationType>({} as ExpoNotificationType);

function FBMessageProvider({children}: React.PropsWithChildren) {

  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [data, setData] = useState<any>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {

    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      setData(response?.notification?.request?.content)
      console.log('response', response.notification.request.content);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  return <FBMessageContext.Provider value={{token: expoPushToken, notification}}>
      {children}
  </FBMessageContext.Provider>
}

function useFBM(): ExpoNotificationType {

    const context = useContext(FBMessageContext);
    if (! context) {
        throw new Error('useFBM must be used within an FBMessageProvider');
    }

    return context;
}

export {FBMessageProvider, useFBM}
