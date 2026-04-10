import { View, FlatList, Pressable, StyleSheet, Text, Image, useColorScheme } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { CastContext } from 'react-native-google-cast';
import { CastButton } from './CastButton';

export default function VideoList({list} : {list: VideoRawType[]}) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : '#ffffff';
    const border = isDark ? '#2A2E34' : '#eceef2';
    const text = isDark ? Colors.white : Colors.black;
    const muted = isDark ? '#9AA3AD' : Colors.muted;
    const detail = isDark ? '#D6DBE0' : Colors.darkColor;

    const setCastMedia = (item: VideoRawType) => {
        if (!item.url) {
            return;
        }

        try {
            CastContext.setSharedMediaInfo({
                mediaInfo: {
                    contentId: item.url,
                    contentType: 'application/x-mpegURL',
                    streamType: 'BUFFERED',
                    metadata: {
                        type: 0,
                        metadataType: 0,
                        title: item.designation || 'Video',
                        subtitle: item.category_name || 'AIRWEAR',
                        images: item.cover ? [{ url: item.cover }] : [],
                    },
                    customData: {
                        autoPlay: true,
                        preloadedContent: {
                            mediaUrl: item.url,
                        },
                    },
                },
            });
        } catch {
            // Keep navigation usable even if cast metadata cannot be set.
        }
    };

    const renderItem = ({ item }: any) => (
        <Pressable
            onPress={() => {
                setCastMedia(item);
                router.push({ pathname: '/videos/preview/[slug]', params: { slug: item.slug } });
            }}
            style={({ pressed }) => [styles.renderItem, { backgroundColor: surface, borderColor: border, shadowColor: text }, pressed && styles.renderItemPressed]}
        >
                <View>
                    <Image style={styles.image} source={{uri: item.cover}} />
                    <View style={[styles.imageGradientTop, { backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.2)' }]} />
                    <Pressable
                        style={[styles.castBubble, { borderColor: border, backgroundColor: isDark ? 'rgba(18,20,24,0.78)' : 'rgba(255,255,255,0.9)' }]}
                        onPress={(event) => {
                            event.stopPropagation?.();
                            setCastMedia(item);
                        }}
                        onPressIn={() => setCastMedia(item)}
                    >
                        <CastButton tintColor={text} />
                    </Pressable>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: text }]}>{item.designation}</Text>
                    <Text style={[styles.details, { color: detail }]}>{item.duration_in_text}</Text>
                    <Text style={[styles.coach, { color: muted }]}>Niveau : {item.level_name}</Text>
                    <View style={[styles.accentLine, { backgroundColor: Colors.orange }]} />
                </View>
            </Pressable>
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
        height: 94,
        resizeMode: 'cover',
    },

    imageGradientTop: {
        ...StyleSheet.absoluteFillObject,
    },

    castBubble: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    accentLine: {
        marginTop: 8,
        height: 3,
        width: 34,
        borderRadius: 999,
        opacity: 0.9,
    },
})