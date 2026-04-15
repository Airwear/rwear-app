
import { FlexContainer, Loader } from '@/components';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { VideoRawType } from '@/utils/type-def';
import { _get, apiRoutes } from '@/services/api';
import Colors from '@/constants/Colors';
import { StyleSheet, Pressable, View, useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { VideoList } from '@/components/domains/videos';

export default function VideoTypeListScreen() {

  const navigation = useNavigation();
  const {type} = useLocalSearchParams();

  const [list, setList] = useState<VideoRawType[]>([])
  const [title, setTitle] = useState<string>("Vidéos")
  const [loading, isLoading] = useState<boolean>(true)
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pageBg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.black;
  const controller = new AbortController();

  const url = apiRoutes.trainings + '?category_id=' + type

  const _fecth = () => {

    isLoading(true);

    _get(url, controller)
      .then(response => {
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setList(items);
        setTitle(items[0]?.category_name || 'Vidéos');
      })
      .catch(() => {
        setList([]);
        setTitle('Vidéos');
      })
      .finally(() => isLoading(false))
  }

    useEffect( () => {
        _fecth()
        //return () => controller.abort()
    }, [])

  useEffect(() => {

    navigation.setOptions({ 
      title: title,
      headerRight: () => (
        <Pressable style={[styles.pressable, { backgroundColor: isDark ? '#1B2026' : Colors.lightColor, borderColor: border }]} onPress={_fecth}>
            {({ pressed }) => (
              <FontAwesome
                name="undo"
                size={25}
                color={text}
                style={{opacity: pressed ? 0.5 : 1 }}
              />
            )}
        </Pressable>
      ),
    });
  }, [navigation, title, isDark]);


  if(loading) {
    return <Loader visible />
  }

  return (
    <FlexContainer color={pageBg}>
      <View style={[styles.pageCard, { backgroundColor: surface, borderColor: border }]}> 
        <VideoList list={list} />
      </View>
    </FlexContainer>
  );
}


const styles = StyleSheet.create({

  container: {
      flex: 1,
  },

  pressable : {
    width: 36,
    height: 36,
    justifyContent:'center', 
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
  },

  pageCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eceef2',
    overflow: 'hidden',
    paddingTop: 6,
  },

  containerAction: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
