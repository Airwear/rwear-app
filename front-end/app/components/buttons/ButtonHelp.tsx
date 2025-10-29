import Colors from "@/constants/Colors";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Title from "../Title";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import ModalSlide from "../ModalSlide";

export function ButtonHelp () {

    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<any>(null);
    const [loading, isLoading] = useState<any>(false);
    const [open, setOpen] = useState<boolean>(false)

    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)

    const handleLocation =  async () => {

        isLoading(true)

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});

        setLocation(location);
    }

    const onPressed = () => {
        if(location) {
            //alert('Location : ok' + location?.coords?.latitude);
        } else {
            //alert('Location : nok');
        }

        openModal()
    }

    useEffect(() => {
        handleLocation()
    }, []);
    

    //console.log('User location#ButtonHelp', location?.coords?.latitude)

    return (
        <View style={{marginTop: 16}}>
            <ModalSlide
                isVisible={open} 
                onClose={closeModal}
                title="BESOIN D'ASSISTANCE ?"
                height="90%"
            >
                <Text>Assistance ?</Text>
            </ModalSlide>
            <Title text="Besoin d'assistance ?" />
            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={onPressed}>
                    <FontAwesome
                        name="headphones"
                        size={25}
                        color={Colors.white}
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonLabel}>
                        Contactez-nous !!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: Colors.black,
        height: 60,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 50,
    },
    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 20,
    },

    title: {
        textAlign: 'center',
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 16
    },
});