import { View, FlatList, TouchableOpacity, Pressable, StyleSheet, Text } from "react-native";
import Card from "./Card";
import { HowitWorkType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import ModalSlide from "./ModalSlide";
import { useState } from "react";

const _data: HowitWorkType[] = [
    {
        textFooter: "Comment ça marche ?",
        textBody: "Comment ça marche ?",
        image: require('../assets/images/home/how-it-work.jpg'),
        key: "how_it_work",
    },

    {
        textFooter: "C'est par ici",
        textBody: "Votre service d'assisance auto",
        image: require('../assets/images/home/troubleshooting.jpg'),
        key: "troubleshooting",
    },

    {
        textFooter: "C'est par ici",
        textBody: "Vos besion de travaux",
        image: require('../assets/images/home/troubleshooting.jpg'),
        key: "works",
    }
]

export default function HowitWork() {

    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<HowitWorkType>()

    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)

    const onSelect = (data: HowitWorkType) => {
        openModal()
        setData(data)
    }

    return (
        <View style={styles.container}>
            <ModalSlide 
                isVisible={open} 
                onClose={closeModal}
                title={data?.textBody?.toUpperCase()}
                height="90%"
            >
                <Text>{data?.textBody}</Text>
            </ModalSlide>
            <FlatList
                horizontal
                data={_data}
                keyExtractor={(item) => item.key}
                renderItem={({ item, index }) => (
                    <Pressable style={styles.pressable} onPress={() => onSelect(item)}>
                        <Card 
                            placeholderImageSource={item.image}
                            textFooter={item.textFooter}
                            textBody={item.textBody}
                        />
                    </Pressable>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 15,
        marginBottom: 16,
    },
    pressable: {
        width: 250,
        marginRight: 20,
    }
})