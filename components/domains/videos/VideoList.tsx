import { View, FlatList, Pressable, StyleSheet, Text, Image, useColorScheme } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { CastContext } from 'react-native-google-cast';
import { CastButton } from './CastButton';
import { FontAwesome } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { resolvedBaseURL } from '@/services/api';
import { useAuth } from '@/contexts/authContext';

export default function VideoList({list} : {list: VideoRawType[]}) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : '#ffffff';
    const border = isDark ? '#2A2E34' : '#eceef2';
    const rowSurface = isDark ? '#1A1F25' : '#EDEDED';
    const text = isDark ? Colors.white : Colors.black;
    const muted = isDark ? '#9AA3AD' : Colors.muted;
    const detail = isDark ? '#D6DBE0' : Colors.darkColor;
    const baseWebUrl = useMemo(() => resolvedBaseURL.replace(/\/api\/?$/, ''), []);
    const { authData } = useAuth();
    const token = (authData as any)?.token || (authData as any)?.access_token || (authData as any)?.jwt || (authData as any)?.bearer || (authData as any)?.user?.token;

    const imageHeaders = useMemo(() => {
        const headers: Record<string, string> = {
            Accept: '*/*',
            Referer: `${baseWebUrl}/`,
            Origin: baseWebUrl,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }, [baseWebUrl, token]);

    const toAbsoluteUrl = (rawUrl?: string) => {
        const value = (rawUrl || '').trim();

        if (!value) {
            return '';
        }

        const absolute = /^https?:\/\//i.test(value)
            ? value
            : `${baseWebUrl}${value.startsWith('/') ? '' : '/'}${value}`;

        return encodeURI(absolute);
    };

    const resolvePreviewCandidates = (item: VideoRawType) => {
        const anyItem = item as any;
        const mediaUrl = toAbsoluteUrl(item.url);
        const directSources = [
            toAbsoluteUrl(item.cover),
            toAbsoluteUrl(anyItem.thumbnail),
            toAbsoluteUrl(anyItem.image),
            toAbsoluteUrl(anyItem.preview),
        ].filter(Boolean);

        const derivedSources = mediaUrl && mediaUrl.toLowerCase().includes('.mp4')
            ? [
                mediaUrl.replace(/\.mp4(\?.*)?$/i, '.jpg$1'),
                mediaUrl.replace(/\.mp4(\?.*)?$/i, '.jpeg$1'),
                mediaUrl.replace(/\.mp4(\?.*)?$/i, '.png$1'),
                mediaUrl.replace(/\/([^\/?#]+)\.mp4(\?.*)?$/i, '/thumbnail.jpg$2'),
                mediaUrl.replace(/\/([^\/?#]+)\.mp4(\?.*)?$/i, '/poster.jpg$2'),
            ]
            : [];

        return [...new Set([...directSources, ...derivedSources])];
    };

    const VideoThumb = ({ item }: { item: VideoRawType }) => {
        const candidates = resolvePreviewCandidates(item);
        const [imageIndex, setImageIndex] = useState(0);
        const currentUri = candidates[imageIndex];

        if (currentUri) {
            return (
                <Image
                    style={styles.image}
                    source={{ uri: currentUri, headers: imageHeaders }}
                    onError={() => setImageIndex((prev) => prev + 1)}
                />
            );
        }

        return (
            <View style={[styles.image, styles.imageFallback, { backgroundColor: isDark ? '#1B2026' : '#EEF2F6' }]}>
                <FontAwesome name="play-circle" size={28} color={Colors.orange} />
                <Text style={[styles.fallbackText, { color: text }]} numberOfLines={2}>{item.designation}</Text>
                <Text style={[styles.fallbackSubtext, { color: muted }]} numberOfLines={1}>{item.category_name || 'RWear'}</Text>
            </View>
        );
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
                        images: item.cover ? [{ url: toAbsoluteUrl(item.cover) }] : [],
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
        return (
            <Pressable
                onPress={() => {
                    const trainingRef = String(item.slug || item.id || '');
                    if (!trainingRef) {
                        return;
                    }

                    setCastMedia(item);
                    router.push({ pathname: '/videos/preview/[slug]', params: { slug: trainingRef } });
                }}
                style={({ pressed }) => [styles.renderItem, { backgroundColor: rowSurface, borderColor: border }, pressed && styles.renderItemPressed]}
            >
                    <View style={styles.previewWrap}>
                        <VideoThumb item={item} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: text }]} numberOfLines={1}>{item.designation}</Text>
                        <Text style={[styles.details, { color: detail }]} numberOfLines={1}>{item.duration_in_text || 'Durée indisponible'}</Text>
                        <Text style={[styles.coach, { color: muted }]} numberOfLines={1}>Niveau : {item.level_name || 'Intermédiaire'}</Text>
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
        paddingHorizontal: 6,
    },

    listContainer: {
        paddingBottom: 24,
        paddingTop: 4,
    },

    textContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        flex: 1,
    },

    description: {
        color: Colors.muted,
        fontSize: 15,
        marginBottom: 2
    },

    title: {
        fontSize: 13,
        marginBottom: 4,
        fontWeight: '800',
        textTransform: 'uppercase',
    },

    details: {
        fontSize: 12,
        marginBottom: 3,
    },

    coach: {
        fontSize: 12,
    },

    renderItem: {
        minHeight: 86,
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 0,
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
    },

    renderItemPressed: {
        opacity: 0.88,
    },

    separator: {
        height: 6,
        width: '100%'
    },

    previewWrap: {
        position: 'relative',
        paddingLeft: 8,
    },

    image: {
        width: 92,
        height: 58,
        resizeMode: 'cover',
        backgroundColor: '#D8D8D8',
        borderRadius: 2,
    },

    imageFallback: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingHorizontal: 6,
    },

    fallbackText: {
        fontSize: 8,
        fontWeight: '700',
        textAlign: 'center',
    },

    fallbackSubtext: {
        fontSize: 8,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 1,
    },

    imageGradientTop: {
        display: 'none',
    },

    playBadge: {
        display: 'none',
    },

    playBadgeText: {
        display: 'none',
    },

    castBubble: {
        display: 'none',
    },

    accentLine: {
        display: 'none',
    },

    emptyState: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 16,
    },
})