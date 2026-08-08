import { View, FlatList, Pressable, StyleSheet, Text, ImageBackground, useColorScheme } from "react-native";
import { VideoType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import Title from "@/components/Title";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader";
import { _get, apiRoutes } from "@/services/api";

export default function VideoTypeList() {

    const title = 'Mes séances'.toLocaleUpperCase();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : Colors.white;
    const border = isDark ? '#2A2E34' : '#eceef2';
    const text = isDark ? Colors.white : Colors.black;
    const muted = isDark ? '#9AA3AD' : Colors.muted;
    const desc = isDark ? '#D6DBE0' : Colors.darkColor;
    const [list, setList] = useState<VideoType[]>([]);
    const [loading, isLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const controller = useMemo(() => new AbortController(), []);
    const visibleList: VideoType[] = list;

    useEffect(() => {
        isLoading(true);
        setError('');

        _get(apiRoutes.categories, controller)
            .then((response) => {
                const items = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                      ? response
                      : [];
                setList(items);
            })
            .catch((err: any) => {
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    setList([]);
                    setError('Connectez-vous pour retrouver toutes vos seances.');
                } else {
                    setList([]);
                    setError(err?.friendlyMessage || 'Impossible de charger les categories video.');
                }
            })
            .finally(() => isLoading(false));

        return () => controller.abort();
    }, [controller])

    const renderItem = ({ item }: any) => {
        const hasImage = typeof item.image === 'string' && item.image.trim().length > 0;
        const mediaContent = (
            <>
                <View style={styles.imageOverlay} />
                <View style={styles.imageTopRow}>
                    <View style={[styles.countBadge, { backgroundColor: Colors.orange }]}> 
                        <Text style={styles.countBadgeText}>{item.trainings_count || 0}</Text>
                    </View>
                    <View style={styles.livePill}>
                        <Text style={styles.livePillText}>VIDEOS</Text>
                    </View>
                </View>
                <View style={styles.headerBlock}>
                    <Text style={[styles.title, { color: Colors.white }]} numberOfLines={2}>{item.designation}</Text>
                    <Text style={[styles.subtitle, { color: '#E8EBEF' }]}>Decouvrir les seances</Text>
                </View>
            </>
        );

        const card = (
            <Pressable
                style={({ pressed }) => [styles.renderItem, { backgroundColor: surface, borderColor: border, shadowColor: text }, pressed && styles.renderItemPressed]}
            >
                {hasImage ? (
                    <ImageBackground source={{uri: item.image}} style={[styles.image, {backgroundColor: Colors.black}]}> 
                        {mediaContent}
                    </ImageBackground>
                ) : (
                    <View style={[styles.image, styles.imageFallback, { backgroundColor: isDark ? '#1B2026' : '#15181d' }]}> 
                        {mediaContent}
                    </View>
                )}

                {item.info !== undefined && (
                    <View style={styles.description}>
                        <Text style={[styles.infoText, { color: desc }]} numberOfLines={2}>{item.info}</Text>
                    </View>
                )}

                <View style={[styles.cardFooter, { borderTopColor: border }]}> 
                    <Text style={[styles.cardFooterText, { color: muted }]}>Voir les videos de cette categorie</Text>
                </View>
            </Pressable>
        );

        return (
            <Link
                href={{
                    pathname: '/videos/[type]',
                    params: {type: item.id}
                }}
                asChild
            >
                {card}
            </Link>
        );
    };

    const separator = () => <View style={styles.separator} />;

    if(loading) {
        return <Loader visible={loading} />
    }

    if (visibleList.length === 0) {
        return (
            <View style={styles.container}>
                <Title text={title} size={20} weight="bold" push={2} />
                <Text style={[styles.text, { color: muted }]}>
                    {error || 'Aucune categorie video disponible pour le moment.'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Title text={title} size={20} weight="bold" push={2} />
            <Text style={[styles.text, { color: muted }]}>Choisissez la categorie de votre choix pour vos entrainements videos.</Text>
            <FlatList
                data={visibleList}
                keyExtractor={(item:any) => String(item.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={separator}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                snapToAlignment="start"
                snapToInterval={290}
                decelerationRate="fast"
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
        paddingRight: 10,
    },

    text: {
        marginBottom: 12,
        fontSize: 13,
        lineHeight: 18,
    },

    description: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    headerBlock: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 10,
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },

    title: {
        fontSize: 16,
        marginBottom: 4,
        fontWeight: 'bold',
        flex: 1,
    },

    countBadge: {
        minWidth: 34,
        height: 22,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },

    countBadgeText: {
        color: Colors.white,
        fontSize: 11,
        fontWeight: '700',
    },

    subtitle: {
        fontSize: 12,
        fontWeight: '600',
    },

    infoText: {
        fontSize: 13,
    },

    renderItem: {
        width: 280,
        minHeight: 238,
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

    seeMoreBtn: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 6,
    },

    seeMoreText: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 3,
    },

    seeMoreSubtext: {
        fontSize: 12,
    },

    separator: {
        width: 10,
    },

    image: {
        height: 162,
        resizeMode: 'cover',
    },

    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.black,
        opacity: 0.38,
    },

    imageTopRow: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    imageFallback: {
        overflow: 'hidden',
    },

    livePill: {
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    livePillText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    cardFooter: {
        borderTopWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },

    cardFooterText: {
        fontSize: 12,
        fontWeight: '600',
    },

    
})
