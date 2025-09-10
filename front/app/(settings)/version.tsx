import { Text, StyleSheet } from 'react-native';
import { FlexContainer, Title } from '@/components';
import { Link, useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function VersionScreen() {

  const navigation = useNavigation();
  const title = "Version de l'application";

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation]);

  return (
    <FlexContainer push>
      <Title text="V1.0.0" push={5} size={17} weight='bold' />
      <Text>- Création d'un compte</Text>
      <Text>- Entrainements vidéos</Text>
      <Text>- Podomètres</Text>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});
