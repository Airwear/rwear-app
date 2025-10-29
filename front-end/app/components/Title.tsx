import Colors from "@/constants/Colors";
import { TitleType } from "@/utils/type-def";
import { Text, StyleSheet, View } from "react-native";

export default function Title({text, size = 23, push = 16, color = Colors.black, align = 'left', weight = 'normal'}: TitleType) {
    
    if(text === undefined || text?.length === 0) {
        return null
    }

    return (
        <View>
            <Text style={[
                styles.title, {fontSize: size, color: color, marginBottom: push, textAlign: align, fontWeight: weight}
            ]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 23,
        //fontWeight: 'bold',
        marginBottom: 16
    },
});