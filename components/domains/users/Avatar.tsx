import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import { icons } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { AvatarType } from "@/utils/type-def";

export default function Avatar({uri, pickUpHandler, allowPickup} : AvatarType) {

    return (
      <View style={{justifyContent: 'center', marginBottom: 16, alignItems: 'center'}}>
        <View style={styles.container}>
          <Image style={styles.image} source={uri ? {uri: uri} : icons.userProfile} />
          {allowPickup && (
            <TouchableOpacity style={styles.editImage} onPress={pickUpHandler}>
                <FontAwesome color={Colors.muted} name='camera' size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: 150,
    },

    image: {
      borderWidth: 5,
      borderColor: '#f0f9f9',
      height: 150,
      width: 150,
      borderRadius: 100
    },

    editImage: {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f9f9',
      position: 'absolute',
      bottom: 1,
      right: 4,
      borderWidth: 2,
      borderColor: '#f0f9f9',
      borderRadius: 45
    },

  });