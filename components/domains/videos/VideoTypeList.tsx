import { View, FlatList, Pressable, StyleSheet, Text, ImageBackground } from "react-native";
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

    const renderItem = ({ item }: any) => (
        <Link
            href={{
                pathname: '/videos/[type]',
                params: {type: item.id}
            }}
            asChild
        >
            <Pressable style={({ pressed }) => [styles.renderItem, pressed && styles.renderItemPressed]}>
                <View style={styles.headerBlock}>
                    <Text style={[styles.title]}>{item.designation}</Text>
                    <Text style={styles.subtitle}>Découvrir les séances</Text>
                </View>
                <ImageBackground source={{uri: item.image}} style={[styles.image, {backgroundColor: Colors.black}]}>
                    <View style={styles.imageOverlay} />
                </ImageBackground>
                {item.info !== undefined && (
                    <View style={styles.description}>
                        <Text style={styles.infoText} numberOfLines={2}>{item.info}</Text>
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
            <Title text={title} size={20} weight="bold" push={2} />
            <Text style={styles.text}>Choisissez la catégorie de votre choix pour vos entrainements vidéos.</Text>
            <FlatList
                data={list}
                keyExtractor={(item:any) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={separator}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingBottom: 140,
    },

    listContainer: {
        paddingBottom: 20,
    },

    text: {
        marginBottom: 12,
        color: Colors.muted,
        fontSize: 13,
    },

    description: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    headerBlock: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 6,
    },

    title: {
        fontSize: 15,
        marginBottom: 2,
        fontWeight: 'bold',
        color: Colors.black,
    },

    subtitle: {
        fontSize: 12,
        color: Colors.muted,
    },

    infoText: {
        color: Colors.darkColor,
        fontSize: 13,
    },

    renderItem: {
        backgroundColor: Colors.white,
        height: 170,
        borderRadius: 14,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eceef2',
    },

    renderItemPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.995 }],
    },

    separator: {
        height: 2,
    },

    image: {
        flex: 1,
        resizeMode: 'cover',
    },

    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.black,
        opacity: 0.15,
    },

    
})