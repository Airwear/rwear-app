import {ModalSlide, Title} from "@/components";
import { StyleSheet, View } from "react-native";
import { AuthDataType } from "@/utils/type-def";
import Colors from "@/constants/Colors";


export default function UserInfo(authData: AuthDataType) {
    return (
      <View style={styles.container}>
        <Title
            text={authData.username as string}
            size={20} 
            weight="bold"
            push={2}
        />
        <Title
            text={`${authData.email}`}
            size={17} 
            color={Colors.muted}
            push={0}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
  });