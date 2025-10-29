import { FlexContainer, Settings } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import Colors from '@/constants/Colors';

export default function IndexScreen() {

  const navigation = useNavigation();
  const title = "Paramètres";

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation]);

  return (
    <FlexContainer color={Colors.white}>
      <Settings />
    </FlexContainer>
  );
}
