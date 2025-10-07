import { Text, StyleSheet } from 'react-native';
import { FlexContainer } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function howItWorkScreen() {

  const navigation = useNavigation();
  const title = "Comment ça marche";

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation]);

  return (
    <FlexContainer>
      <Text>howItWorkScreen</Text>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
});
