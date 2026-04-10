import { FlexContainer, Settings } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function IndexScreen() {

  const navigation = useNavigation();
  const title = "Paramètres";
  const scheme = useColorScheme();
  const bg = scheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const text = scheme === 'dark' ? Colors.white : Colors.darkColor;
  const headerBg = scheme === 'dark' ? '#121418' : Colors.white;
  const border = scheme === 'dark' ? '#2A2E34' : '#eceef2';

  useEffect(() => {
    navigation.setOptions({
      title,
      headerStyle: {
        backgroundColor: headerBg,
      },
      headerTitleStyle: {
        color: text,
        fontWeight: '700',
      },
      headerTintColor: text,
      headerShadowVisible: true,
      headerLargeTitle: false,
      headerTransparent: false,
    });
  }, [navigation, headerBg, text]);

  return (
    <FlexContainer color={bg}>
      <Settings />
    </FlexContainer>
  );
}
