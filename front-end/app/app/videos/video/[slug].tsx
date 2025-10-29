
import { FlexContainer, ImageViewer, Indicator, Loader } from '@/components';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { VideoRawType } from '@/utils/type-def';
import { _get, _post, apiRoutes } from '@/services/api';
import Colors from '@/constants/Colors';
import { StyleSheet, View, Text, Pressable,} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from '@/components/domains/videos';
import axios from 'axios';

export default function VideoItemScreen() {

  const navigation = useNavigation();
  const {slug} = useLocalSearchParams();

  const [video, setVideo] = useState<VideoRawType>({} as VideoRawType)
  const [loading, isLoading] = useState<boolean>(false)
  const controller = new AbortController();

  const _fecth = () => {

    isLoading(true);

    axios
    .get('https://rwear-sport.octet-group.org/api/trainings/' + slug)
    .then(response => {
        //console.log('response item', response.data.data)
        setVideo(response.data.data)
    }).finally(() => isLoading(false))
  }

    useEffect( () => {
        _fecth()
        //return () => controller.abort()
    }, [])


  useEffect(() => {

    navigation.setOptions({ 
      title: video.designation,
      headerRight: () => (
        <Pressable style={styles.pressable} onPress={_fecth}>
            {({ pressed }) => (
              <FontAwesome
                name="undo"
                size={25}
                color={Colors.black}
                style={{opacity: pressed ? 0.5 : 1 }}
              />
            )}
        </Pressable>
      ),
    });
 
  }, [navigation, video]);

  if(loading || video.id === undefined) {
    return <Loader visible />
  }

  return (
    <FlexContainer color={Colors.white}>
      <Video {...video}  />
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
