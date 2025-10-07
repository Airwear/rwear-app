import { Text, StyleSheet } from 'react-native';
import { FlexContainer } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function PolicyScreen() {

  const navigation = useNavigation();
  const title = "Conditions d'utulisation";

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation]);

  return (
    <FlexContainer>
      <Text>PolicyScreen</Text>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
});
