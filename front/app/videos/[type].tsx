
import { FlexContainer, ImageViewer, Indicator, Loader } from '@/components';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { VideoRawType } from '@/utils/type-def';
import { _get, _post, apiRoutes } from '@/services/api';
import Colors from '@/constants/Colors';
import { StyleSheet, Pressable} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { VideoList } from '@/components/domains/videos';
import axios from 'axios';

export default function VideoTypeListScreen() {

  const navigation = useNavigation();
  const {type} = useLocalSearchParams();

  const [list, setList] = useState<VideoRawType[]>([])
  const [title, setTitle] = useState<string>("Vidéos")
  const [loading, isLoading] = useState<boolean>(true)
  const controller = new AbortController();

  const url = apiRoutes.trainings + '?category_id=' + type

  const _fecth = () => {

    isLoading(true);

    _get(url, controller)
    .then(response => {
        //console.log('response', response.data)
        setList(response.data);
        setTitle(response.data[0]?.category_name);
    }).finally(() => isLoading(false))
  }

    useEffect( () => {
        _fecth()
        //return () => controller.abort()
    }, [])

  useEffect(() => {

    navigation.setOptions({ 
      title: title,
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
  }, [navigation, title]);


  if(loading) {
    return <Loader visible />
  }

  return (
    <FlexContainer color={Colors.white}>
      <VideoList list={list} />
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

  containerAction: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
