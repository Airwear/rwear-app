import { View, FlatList, Pressable, StyleSheet, Text, Image, useColorScheme } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { CastContext } from 'react-native-google-cast';
import { CastButton } from './CastButton';
import { FontAwesome } from '@expo/vector-icons';

export default function VideoList({list} : {list: VideoRawType[]}) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : '#ffffff';
    const border = isDark ? '#2A2E34' : '#eceef2';
    const text = isDark ? Colors.white : Colors.black;
    const muted = isDark ? '#9AA3AD' : Colors.muted;
    const detail = isDark ? '#D6DBE0' : Colors.darkColor;

    const resolvePreview = (item: VideoRawType) => {
        if (item.cover && item.cover.trim().length > 0) {
            return item.cover;
        }

        if (item.url && item.url.toLowerCase().includes('.mp4')) {
            return item.url.replace(/\.mp4(\?.*)?$/i, '.jpeg$1');
        }

        return undefined;
    };

    const setCastMedia = (item: VideoRawType) => {
        if (!item.url) {
            return;
        }

        const value = item.url.toLowerCase();
        const contentType = value.endsWith('.m3u8') || value.includes('m3u8')
            ? 'application/x-mpegURL'
            : value.endsWith('.mpd') || value.includes('manifest.mpd') || value.includes('/dash')
                ? 'application/dash+xml'
                : 'video/mp4';

        try {
            CastContext.setSharedMediaInfo({
                mediaInfo: {
                    contentId: item.url,
                    contentType,
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

    const renderItem = ({ item }: any) => {
        const previewUri = resolvePreview(item);

        return (
            <Pressable
                onPress={() => {
                    setCastMedia(item);
                    router.push({ pathname: '/videos/preview/[slug]', params: { slug: item.slug } });
                }}
                style={({ pressed }) => [styles.renderItem, { backgroundColor: surface, borderColor: border, shadowColor: text }, pressed && styles.renderItemPressed]}
            >
                    <View style={styles.previewWrap}>
                        {previewUri ? (
                            <Image style={styles.image} source={{uri: previewUri}} />
                        ) : (
                            <View style={[styles.image, styles.imageFallback, { backgroundColor: isDark ? '#1B2026' : '#EEF2F6' }]}>
                                <FontAwesome name="play-circle" size={28} color={Colors.orange} />
                                <Text style={[styles.fallbackText, { color: text }]}>Aperçu vidéo</Text>
                            </View>
                        )}
                        <View style={[styles.imageGradientTop, { backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.2)' }]} />
                        <View style={styles.playBadge}>
                            <FontAwesome name="play" size={12} color="#fff" />
                            <Text style={styles.playBadgeText}>Voir</Text>
                        </View>
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
    };

    const separator = () => <View style={styles.separator} />;

    if (!list || list.length === 0) {
        return (
            <View style={styles.container}>
                <View style={[styles.emptyState, { backgroundColor: surface, borderColor: border }]}> 
                    <Text style={[styles.title, { color: text }]}>Aucune vidéo visible</Text>
                    <Text style={[styles.details, { color: muted }]}>Cette categorie est vide ou votre session n'a pas encore acces au catalogue.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={list}
                keyExtractor={(item:any) => String(item.id)}
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
        minHeight: 118,
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

    previewWrap: {
        position: 'relative',
    },

    image: {
        width: 138,
        height: 118,
        resizeMode: 'cover',
    },

    imageFallback: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 8,
    },

    fallbackText: {
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },

    imageGradientTop: {
        ...StyleSheet.absoluteFillObject,
    },

    playBadge: {
        position: 'absolute',
        left: 8,
        bottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.58)',
    },

    playBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
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

    emptyState: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 16,
    },
})