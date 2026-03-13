import { View, FlatList, Pressable, StyleSheet, Text, Image } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

export default function VideoList({list} : {list: VideoRawType[]}) {

    const renderItem = ({ item }: any) => (
        <Link
            href={{
                pathname: '/videos/play/[slug]',
                params: {
                    slug: item.slug,
                }
            }}
            asChild
            push
        >
            <Pressable style={({ pressed }) => [styles.renderItem, pressed && styles.renderItemPressed]}>
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
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },

    listContainer: {
        paddingBottom: 24,
    },

    textContainer: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'center',
        flex: 1,
    },

    description: {
        color: Colors.muted,
        fontSize: 15,
        marginBottom: 2
    },

    title: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: Colors.black,
    },

    details: {
        fontSize: 13,
        marginBottom: 3,
        color: Colors.darkColor,
    },

    coach: {
        fontSize: 13,
        color: Colors.muted,
    },

    renderItem: {
        backgroundColor: '#ffffff',
        minHeight: 94,
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eceef2',
    },

    renderItemPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.995 }],
    },

    separator: {
        height: 8,
        width: '100%'
    },

    image: {
        width: 110,
        resizeMode: 'cover',
    },
})