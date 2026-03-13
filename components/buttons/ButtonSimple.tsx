import Colors from "@/constants/Colors";
import { Text, StyleSheet, View, Pressable } from "react-native";
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
    disabled?: boolean
}

export default function ButtonSimple(
    {
        color = Colors.primary, 
        width = '100%', 
        textColor = '#fff', 
        text, 
        onPress,
        showIndicator = false,
        disabled = false
    }
    : ButtonType) 
    {
    return (
        <View style={[styles.content, {backgroundColor: color, width: width, opacity: disabled ? 0.65 : 1}]}>
            {showIndicator && <Indicator />}
            {! showIndicator && (
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={onPress}
                    disabled={disabled}
                >
                    <Text style={[styles.buttonLabel, {color: textColor}]}>{text}</Text>
                </Pressable>
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
            <Pressable
                disabled={showIndicator}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: color, flexDirection: 'row' },
                    pressed && styles.buttonPressed,
                ]}
                onPress={onPress}
            >
                <FontAwesome
                    name={iconName}
                    size={22}
                    color={Colors.white}
                    style={styles.buttonIcon}
                />
                <Text style={styles.buttonLabel}>{text}</Text>
                {showIndicator && <Indicator color="white" />}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: Colors.black,
        minHeight: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        minHeight: 54,
    },

    buttonPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.99 }],
    },

    buttonIcon: {
        paddingRight: 8,
    },

    buttonLabel: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
        marginRight: 0,
    },
});