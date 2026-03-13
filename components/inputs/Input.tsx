import Colors from "@/constants/Colors";
import { InputType } from "@/utils/type-def";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";

export default function Input({value, onChangeText, label, placeholder, error, secureTextEntry = false, keyboardType = 'default', required = false}: InputType) {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
                {required && <Text style={styles.required}>*</Text>}
            </View>
            <TextInput
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                autoCorrect={false}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
            <Text style={styles.error}>{error}</Text>
        </View>
    )
}

export function InputPassword({value, onChangeText, label, placeholder, error, secureTextEntry = false, keyboardType = 'default', required = false}: InputType) {
    
    const [clicked, setClicked] = useState<boolean>(false);
    const _handleClicked = () => setClicked(prevState => !prevState);

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
                {required && <Text style={styles.required}>*</Text>}
            </View>

            <View style={styles.containerPassword} >
                <TextInput
                    secureTextEntry={! clicked}
                    placeholder={placeholder}
                    autoCorrect={false}
                    style={[styles.input, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                />
                <TouchableOpacity onPress={_handleClicked} style={styles.containerPasswordIcon}>
                    <FontAwesome
                        name={clicked ? 'eye' : 'eye-slash'}
                        size={22}
                        color={clicked ? Colors.black : Colors.muted }
                        style={styles.buttonIcon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.error}>{error}</Text>
        </View>
    )
}

export function InputWithIcon({value, onChangeText, label, info, error, secureTextEntry = false, keyboardType = 'default', required = false, iconName = 'user'}: InputType) {
    return (
        <View>
            <View style={styles.containerWithIcon}>
                
                <View style={styles.iconWrapper}>
                    <FontAwesome color={Colors.primary} name={iconName} size={25} />
                </View>

                <TextInput
                    secureTextEntry={secureTextEntry}
                    placeholder={label}
                    autoCorrect={false}
                    style={[styles.input, styles.inputWithIcon]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                />
            </View>
            {info !== undefined && <Text style={[styles.error, {color: Colors.muted}]}>{info}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        minHeight: 86,
        padding: 4,
        marginBottom: 4,
    },


    labelRow: {
        flexDirection: 'row',
    },


    containerWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        minHeight: 54,
        backgroundColor: '#fcfcfd',
        borderWidth: 1,
        borderColor: '#e2e5ea',
        marginBottom: 2,
        borderRadius: 12,
    },

    iconWrapper: {
        flexDirection: 'row',
        width: 30,
    },

    containerPassword: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    containerPasswordIcon: {
        width: 50,
        backgroundColor: '#f0f1f4',
        height: 47,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -2,
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e5ea',
        borderLeftWidth: 0,
    },

    label: {
        fontSize: 11,
        marginBottom: 4,
        color: Colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    required: {
        fontSize: 15,
        color: Colors.danger,
        marginLeft: 3,
        marginTop: -5
    },
    
    input: {
        color: Colors.black,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#e2e5ea',
        backgroundColor: '#fcfcfd',
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 2,
        flex: 1,
        height: 47,
    },

    inputWithIcon: {
        borderColor: '#e2e5ea',
        marginBottom: 0,
        backgroundColor: '#fcfcfd',
    },

    error: {
        fontSize: 12,
        color: Colors.danger,
        marginTop: 2,
    },

    buttonIcon: {
    },
});