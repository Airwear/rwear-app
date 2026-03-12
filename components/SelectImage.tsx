import { StyleSheet, View, TouchableOpacity, Platform, Alert} from 'react-native';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function SelectImage({apiUri, onCancel, onImageSelected, onError}: {
  onCancel: () => void, 
  onImageSelected: (image: any) => void,
  onError: (error: any) => void,
  apiUri: string
}) {

  const controller = new AbortController

  const pickImage = async (mode?: 'gallery') => {

    try {

      let result

      if(mode === 'gallery') {

        await ImagePicker.requestMediaLibraryPermissionsAsync();

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          //base64: true
        });

      } else {

        ImagePicker.requestCameraPermissionsAsync();

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          aspect: [1, 1],
          allowsEditing: true,
          quality: 1,
          //base64: true
        });

      }
      

      console.log(result);

      if (!result.canceled) {
        onImageSelected(result.assets[0])
      }
      
    } catch(error: any) {
      console.log('error', error);
      Alert.alert('Error', error.message)
    }
    
  };


  const sendImageToBackEnd = async (imageData: any) => {
    const form = new FormData()

    const fileInfo = {
      uri: imageData.uri,
      type: imageData.mimeType,
      name: imageData.fileName
    };

    //form.append('file', fileInfo, imageData.fileName);

    // _post(apiUri, form, controller, {'Content-Type': 'multipart/form-data'})
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
          <FontAwesome color={Colors.primary} name='camera' size={25} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => pickImage('gallery')}>
          <FontAwesome color={Colors.primary} name='image' size={25} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <FontAwesome color={Colors.muted} name='trash' size={25} />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  button: {
    width: 50,
    height: 50,
    backgroundColor: Colors.lightColor,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 10
  },
});
