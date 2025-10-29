import { StyleSheet,} from 'react-native';
import { FlexContainer, NotFound, } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect, } from 'react';
import Colors from '@/constants/Colors';
import {useAuth} from '@/hooks';
import { useApp } from '@/contexts/appContext';

export default function RegisterScreen() {

  const navigation = useNavigation();
  const {label} = useApp();
  const { authData } = useAuth();

  useEffect(() => {
    navigation.setOptions({ 
      title: "Planning",
    });
  }, [navigation]);

  return (
    <FlexContainer color={Colors.white} push>
      <NotFound />
    </FlexContainer>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 16,
    //justifyContent: 'center'
  },

  imageContainer: {
    alignItems: 'center',
  },

  title: {
    color: Colors.muted,
    fontSize: 17
  },

  new: {
    fontWeight: 'bold',
    color: Colors.green
  },

  buttonAction: {
    padding: 4
  },
});
