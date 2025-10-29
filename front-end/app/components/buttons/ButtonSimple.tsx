import Colors from "@/constants/Colors";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Indicator } from "../Loader";
import { FontAwesome } from "@expo/vector-icons";

type ButtonType = {
    color?: any; 
    width?: any; 
    textColor?: string; 
    text: string; 
    onPress?: () => void;
    showIndicator?: boolean
    iconName?: any
}

export default function ButtonSimple(
    {
        color = Colors.primary, 
        width = '100%', 
        textColor = '#fff', 
        text, 
        onPress,
        showIndicator = false
    }
    : ButtonType) 
    {
    return (
        <View style={[styles.content, {backgroundColor: color, width: width}]}>
            {showIndicator && <Indicator />}
            {! showIndicator && (
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={[styles.buttonLabel, {color: textColor}]}>{text}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export  function ButtonWithIcon(
    {
        color = Colors.black, 
        width = '100%', 
        textColor = '#fff', 
        text, 
        onPress,
        showIndicator = false,
        iconName = 'plus'
    }: ButtonType
) {
    return (
        <View>
            <TouchableOpacity disabled={showIndicator} style={[styles.button, {backgroundColor: color, flexDirection: 'row'}]} onPress={onPress}>
                <FontAwesome
                    name={iconName}
                    size={22}
                    color={Colors.white}
                    style={styles.buttonIcon}
                />
                <Text style={styles.buttonLabel}>{text}</Text>
                {showIndicator && <Indicator color="white" />}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: Colors.black,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        height: 55,
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase', 
        marginRight: 5
    },
});