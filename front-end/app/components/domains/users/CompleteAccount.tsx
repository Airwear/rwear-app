import {ModalSlide, Title} from "@/components";
import { ButtonSimple } from "@/components/buttons";
import Colors from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import { AuthDataType } from "@/utils/type-def";
import { router } from "expo-router";

export default function CompleteAccount(authData: AuthDataType) {

    if (authData.completed) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Title
            text="Complétez votre profile pour bénéficier d'une assistance Fix Solutions" 
            size={20} 
        />
          <ButtonSimple
              color={Colors.greenLight} 
              width='100%' 
              text="Je complète mon profil"
              textColor={Colors.green}
              onPress={ () => router.navigate('edit-user')}
          />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
  });