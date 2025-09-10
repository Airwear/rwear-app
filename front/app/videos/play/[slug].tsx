
import { FlexContainer, ImageViewer, Indicator, Loader } from '@/components';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { VideoRawType } from '@/utils/type-def';
import { _get, _post, apiRoutes } from '@/services/api';
import Colors from '@/constants/Colors';
import { StyleSheet,} from 'react-native';
import { Player } from '@/components/domains/videos';
import { useAuth } from '@/contexts/authContext';
import Player1 from '@/components/domains/videos/Player1';


export default function VideoPlayerScreen() {

  const navigation = useNavigation();
  const {slug} = useLocalSearchParams();
  const {authData} = useAuth()

  const [loading, isLoading] = useState<boolean>(false);
  const [video, setVideo] = useState<VideoRawType>({} as VideoRawType);
  const controller = new AbortController();

  const _fetch = async () => {
    
    let url = apiRoutes.trainings + '/' + slug;
    isLoading(true);

    _get(url, controller, {})
        .then(response => {
          //console.log('_vidéo', response.data);
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
    });

    _fetch();

    // return () => controller.abort()
 
  }, [navigation]);
  

  if(loading && video === undefined) {
    return <Loader visible />
  }

  return (
    <FlexContainer color={Colors.white}>
      <Player1 {...video} />
    </FlexContainer>
  );
}

const styles = StyleSheet.create({

  container: {
      flex: 1,
  },

  pressable : {
    width: 45, 
    height: 30, 
    justifyContent:'center', 
    alignItems: 'center'
  },
});
