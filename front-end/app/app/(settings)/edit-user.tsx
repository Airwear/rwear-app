import { FlexContainer, SelectImage } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/authContext';
import { Avatar, UserInfo, EditUserForm } from '@/components/domains/users';
import { Dialog } from 'react-native-simple-dialogs';

export default function EditUserScreen() {

  const navigation = useNavigation();
  const { signOut, authData } = useAuth();
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);

  const title = "Mon compte";

  const onImageSelected = (image: any) => {
    setModalIsVisible(false)
    setImage(image)
  }

  const onError = (error: any) => {
    setModalIsVisible(false)
    Alert.alert('Error', error.message)
    console.log('error', error.message)
  }

  const onCancelImage = () => {
    setModalIsVisible(false)
    //setImage(null)
  }

  useEffect(() => {
    navigation.setOptions({ 
      title: title,
      headerRight: () => (
        <Pressable style={styles.pressable} onPress={signOut}>
            {({ pressed }) => (
              <FontAwesome
                name="sign-out"
                size={26}
                color={Colors.black}
                style={{opacity: pressed ? 0.5 : 1 }}
              />
            )}
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <FlexContainer push color={Colors.white}>
      {/** 
       <Avatar 
        uri={image?.uri} 
        allowPickup={false}
        pickUpHandler={() => setModalIsVisible(true)} 
      /> 
      */}
      

      <Dialog
        visible={modalIsVisible}
        title="Select Image"
        onTouchOutside={() => setModalIsVisible(false)}
        onRequestClose={() => setModalIsVisible(false)}
        contentInsetAdjustmentBehavior="never"
      >
        <SelectImage 
          onCancel={onCancelImage} 
          onImageSelected={onImageSelected} 
          onError={onError}
          apiUri='/'
        />
      </Dialog>

      {authData !== undefined && <UserInfo {...authData} />}
      <ScrollView>
        <EditUserForm />
      </ScrollView>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  pressable : {
    width: 45, 
    height: 30, 
    justifyContent:'center', 
    alignItems: 'center'
  }
})
