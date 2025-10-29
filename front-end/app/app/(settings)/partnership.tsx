import { Text, StyleSheet } from 'react-native';
import { FlexContainer } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function PartnershipScreen() {

  const navigation = useNavigation();
  const title = "Devenir partenaire";

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation]);

  return (
    <FlexContainer>
      <Text>PartnershipScreen</Text>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
});
