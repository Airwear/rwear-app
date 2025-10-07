import { View, FlatList, TouchableOpacity, Pressable, StyleSheet, Text, ImageBackground } from "react-native";
import { VideoType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import axios from "axios";

export default function VideoTypeList() {

    const title = 'Mes séances'.toLocaleUpperCase();
    const [list, setList] = useState<VideoType[]>([]);
    const [loading, isLoading] = useState<boolean>(false);

    useEffect( () => {

        isLoading(true);

        axios
        .get('https://rwear-sport.octet-group.org/api/categories')
        .then(response => {
            //console.log('response', response.data.data)
            setList(response.data.data)
        }).finally(() => isLoading(false))

    }, [])

    const renderItem = ({ item, index }: any) => (
        <Link
            href={{
                pathname: '/videos/[type]',
                params: {type: item.id}
            }}
            asChild
        >
            <Pressable style={styles.renderItem}>
                <View style={styles.description}>
                    <Text style={[styles.title]}>{item.designation}</Text>
                </View>
                <ImageBackground source={{uri: item.image}} style={[styles.image, {backgroundColor: '#000'}]}>
                    
                </ImageBackground>
                {item.info !== undefined && (
                    <View style={styles.description}>
                        <Text>{item.info}</Text>
                    </View>
                )}
            
            </Pressable>
        </Link>
    );

    const separator = () => <View style={styles.separator} />;

    if(loading) {
        return <Loader visible={loading} />
    }

    if (list.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Title text={title} size={18} push={2} />
            <Text style={styles.text}>Choisissez la catégorie de votre choix pour vos entrainements vidéos.</Text>
            <FlatList
                data={list}
                keyExtractor={(item:any) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={separator}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 150
    },

    text: {
        marginBottom: 10,
    },

    description: {
        color: Colors.muted,
        fontSize: 15,
        padding: 5
    },

    title: {
        fontSize: 14,
        marginBottom: 5,
        //color: Colors.white,
        fontWeight: 'bold',
    },

    renderItem: {
        backgroundColor: Colors.lightColor,
        //justifyContent: 'center',
        height: 150,
        borderRadius: 10,
        marginBottom: 10
    },

    separator: {
        backgroundColor: Colors.white,
        width: 2,
    },

    image: {
        flex: 1,
        resizeMode: 'cover',
        padding: 10,
    },

    
})