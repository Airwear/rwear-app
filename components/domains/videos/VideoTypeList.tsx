import { View, FlatList, Pressable, StyleSheet, Text, ImageBackground, useColorScheme } from "react-native";
import { VideoType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import axios from "axios";
import { useGuestGuard } from "@/hooks";
import GuestConversionModal from "@/components/GuestConversionModal";

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
    const { isGuest, requireAuth, guestModalVisible, closeGuestModal } = useGuestGuard();

    const visibleList = isGuest ? list.slice(0, 3) : list;

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
            <Pressable style={({ pressed }) => [styles.renderItem, { backgroundColor: surface, borderColor: border, shadowColor: text }, pressed && styles.renderItemPressed]}>
                <View style={styles.headerBlock}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.title, { color: text }]}>{item.designation}</Text>
                      <View style={[styles.countBadge, { backgroundColor: Colors.orange }]}> 
                        <Text style={styles.countBadgeText}>{item.trainings_count || 0}</Text>
                      </View>
                    </View>
                    <Text style={[styles.subtitle, { color: muted }]}>Decouvrir les seances</Text>
                </View>
                <ImageBackground source={{uri: item.image}} style={[styles.image, {backgroundColor: Colors.black}]}>
                    <View style={styles.imageOverlay} />
                </ImageBackground>
                {item.info !== undefined && (
                    <View style={styles.description}>
                        <Text style={[styles.infoText, { color: desc }]} numberOfLines={2}>{item.info}</Text>
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
            <Text style={[styles.text, { color: muted }]}>
                {isGuest
                    ? 'Mode invite: seulement quelques categories sont visibles. Connectez-vous pour tout voir.'
                    : 'Choisissez la categorie de votre choix pour vos entrainements videos.'}
            </Text>
            <FlatList
                data={visibleList}
                keyExtractor={(item:any) => String(item.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={separator}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            {isGuest && list.length > 3 ? (
                <Pressable
                    style={({ pressed }) => [
                        styles.seeMoreBtn,
                        { borderColor: border, backgroundColor: surface },
                        pressed && styles.renderItemPressed,
                    ]}
                    onPress={() => requireAuth()}
                >
                    <Text style={[styles.seeMoreText, { color: text }]}>Voir plus de categories</Text>
                    <Text style={[styles.seeMoreSubtext, { color: muted }]}>Connexion requise pour acceder a tout le catalogue</Text>
                </Pressable>
            ) : null}

            <GuestConversionModal visible={guestModalVisible} onClose={closeGuestModal} />
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
        fontSize: 13,
        lineHeight: 18,
    },

    description: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    headerBlock: {
        paddingHorizontal: 10,
        paddingTop: 12,
        paddingBottom: 6,
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },

    title: {
        fontSize: 15,
        marginBottom: 2,
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
    },

    infoText: {
        fontSize: 13,
    },

    renderItem: {
        minHeight: 186,
        borderRadius: 14,
        marginBottom: 10,
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
        height: 2,
    },

    image: {
        flex: 1,
        resizeMode: 'cover',
    },

    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.black,
        opacity: 0.22,
    },

    
})