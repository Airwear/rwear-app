import { View, FlatList, Pressable, StyleSheet, Text, Image, useColorScheme } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

export default function VideoList({list} : {list: VideoRawType[]}) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : '#ffffff';
    const border = isDark ? '#2A2E34' : '#eceef2';
    const text = isDark ? Colors.white : Colors.black;
    const muted = isDark ? '#9AA3AD' : Colors.muted;
    const detail = isDark ? '#D6DBE0' : Colors.darkColor;

    const renderItem = ({ item }: any) => (
        <Link
            href={{
                pathname: '/videos/preview/[slug]',
                params: {
                    slug: item.slug,
                }
            }}
            asChild
            push
        >
            <Pressable style={({ pressed }) => [styles.renderItem, { backgroundColor: surface, borderColor: border, shadowColor: text }, pressed && styles.renderItemPressed]}>
                <Image style={styles.image} source={{uri: item.cover}} />
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: text }]}>{item.designation}</Text>
                    <Text style={[styles.details, { color: detail }]}>{item.duration_in_text}</Text>
                    <Text style={[styles.coach, { color: muted }]}>Niveau : {item.level_name}</Text>
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
    },

    details: {
        fontSize: 13,
        marginBottom: 3,
    },

    coach: {
        fontSize: 13,
    },

    renderItem: {
        minHeight: 94,
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
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