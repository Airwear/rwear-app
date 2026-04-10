
import { FlexContainer, Loader } from '@/components';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { VideoRawType } from '@/utils/type-def';
import { _get, _post, apiRoutes } from '@/services/api';
import Colors from '@/constants/Colors';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { useAuth } from '@/contexts/authContext';
import Player1 from '@/components/domains/videos/Player1';


export default function VideoPlayerScreen() {

  const navigation = useNavigation();
  const {slug} = useLocalSearchParams();
  const {authData} = useAuth()

  const [loading, isLoading] = useState<boolean>(false);
  const [video, setVideo] = useState<VideoRawType>({} as VideoRawType);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pageBg = isDark ? Colors.black : '#0f1115';
  const border = isDark ? '#2A2E34' : '#23262b';
  const controller = new AbortController();

  const _fetch = async () => {
    
    let url = apiRoutes.trainings + '/' + slug;
    isLoading(true);

    _get(url, controller, {})
        .then(response => {
          console.log('Video fetched from backend:', response.data);
          console.log('Video URL:', response.data.url);
          console.log('Video format:', typeof response.data.url);
          setVideo(response['data']);
        })
        .catch(error => {
          console.log('error', error.message)
        })
        .finally(() => {

          isLoading(false);
          
          //_viewCount();

        }) 
  };

  const _viewCount = async () => {
    
    let url = apiRoutes.trainings + '/' + slug + '/reporting?user_id=' + authData?.id;
    
    _get(url, controller, {})
        .catch(error => {
          console.log('error', error.message)
        })
        .finally(() => console.log('succeess finally')) 
  };


  useEffect(() => {

    navigation.setOptions({ 
      title: null,
      headerStyle: { backgroundColor: pageBg },
      headerTintColor: Colors.white,
    });

    _fetch();

    // return () => controller.abort()
 
  }, [navigation, pageBg]);
  

  if(loading && video === undefined) {
    return <Loader visible />
  }

  return (
    <FlexContainer color={pageBg}>
      <View style={[styles.playerContainer, { borderColor: border }]}> 
        <Player1 {...video} />
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({

  container: {
      flex: 1,
  },

  playerContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.black,
    borderWidth: 1,
  },

  pressable : {
    width: 45, 
    height: 30, 
    justifyContent:'center', 
    alignItems: 'center'
  },
});
