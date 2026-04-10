
import { FlexContainer, Loader } from '@/components';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { VideoRawType } from '@/utils/type-def';
import { _get, apiRoutes } from '@/services/api';
import Colors from '@/constants/Colors';
import { StyleSheet, View, Text, Pressable, useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from '@/components/domains/videos';
import axios from 'axios';

export default function VideoItemScreen() {

  const navigation = useNavigation();
  const {slug} = useLocalSearchParams();

  const [video, setVideo] = useState<VideoRawType>({} as VideoRawType)
  const [loading, isLoading] = useState<boolean>(false)
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pageBg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.black;
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
 
  }, [navigation, video, isDark]);

  if(loading || video.id === undefined) {
    return <Loader visible />
  }

  return (
    <FlexContainer color={pageBg}>
      <View style={[styles.pageCard, { borderColor: border, backgroundColor: surface }]}> 
        <Video {...video}  />
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
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#111111',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
