import { View, FlatList, Pressable, StyleSheet, Text, Image } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import axios from "axios";

export default function VideoList({list} : {list: VideoRawType[]}) {

    const renderItem = ({ item, index }: any) => (
        <Link
            href={{
                pathname: '/videos/video/[slug]',
                params: {
                    slug: item.slug,
                }
            }}
            asChild
            push
        >
            <Pressable style={styles.renderItem}>
                <Image style={styles.image} source={{uri: item.cover}} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.designation}</Text>
                    <Text style={styles.details}>{item.duration_in_text}</Text>
                    <Text style={styles.coach}>Niveau : {item.level_name}</Text>
                </View>
            </Pressable>
        </Link>
    );

    const separator = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
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
    container: {},

    textContainer: {
        padding: 10,
        justifyContent: 'center'
    },

    description: {
        color: Colors.muted,
        fontSize: 15,
        marginBottom: 2
    },

    title: {
        fontSize: 15,
        marginBottom: 5,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },

    details: {
        fontSize: 14,
        marginBottom: 4
    },

    coach: {
        fontSize: 13,
    },

    renderItem: {
        backgroundColor: Colors.lightColor,
        //justifyContent: 'center',
        height: 90,
        flexDirection: 'row',
        
    },

    separator: {
        backgroundColor: Colors.white,
        height: 4,
        width: '100%'
    },

    image: {
        width: 100,
        resizeMode: 'center',
        borderRadius: 2,
    },
})