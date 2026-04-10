import { View, StyleSheet, Text, Image, useColorScheme } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Title from "@/components/Title";
import { ButtonSimple } from "@/components/buttons";

export default function Video(video: VideoRawType) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : Colors.white;
    const border = isDark ? '#2A2E34' : '#eceef2';
    const text = isDark ? Colors.white : Colors.darkColor;
    const muted = isDark ? '#9AA3AD' : Colors.muted;

    return (
        <View style={[styles.container, { backgroundColor: surface }]}> 
            <View style={styles.cover}>
                <Image style={styles.image} source={{uri: video.cover}} />
            </View>
            <Details {...video} isDark={isDark} />
            <View style={styles.titleContainer}>
                <Title size={21} text={video.designation.toUpperCase()} weight="bold" push={4} color={text} />
                <Text style={[styles.label, { color: text }]}><Text style={styles.labelKey}>Coach :</Text> {video.coach_name}</Text>
                <Text style={[styles.label, { color: text }]}><Text style={styles.labelKey}>Niveau :</Text> {video.level_name}</Text>
                <Text style={[styles.label, { color: text }]}><Text style={styles.labelKey}>Materiels :</Text> {video.materiel_list}</Text>
                <View style={styles.spaceXs} />
                <Text style={[styles.description, { color: text }]}>{video.description}</Text>
            </View>
            <RenderLink {...video} />
        </View>
    )
}


function Details(video: VideoRawType & { isDark?: boolean }) {
    const border = video.isDark ? '#2A2E34' : '#eceef2';
    const bg = video.isDark ? '#1B2026' : '#fcfcfd';
    const muted = video.isDark ? '#9AA3AD' : Colors.muted;
    const text = video.isDark ? '#D6DBE0' : Colors.darkColor;

    return (
        <View style={[styles.detailsContainer, { borderColor: border, backgroundColor: bg }]}> 
            <View style={styles.detailsItem}>
                <FontAwesome
                    name="calendar"
                    size={35}
                    color={muted}
                />
                <Text style={[styles.details, { color: text }]}>{video.duration_in_text}</Text>
            </View>

            <View style={styles.detailsItem}>
                <FontAwesome
                    name="list"
                    size={35}
                    color={muted}
                />
                <Text style={[styles.details, { color: text }]}>{video.level_name}</Text>
            </View>

            <View style={styles.detailsItem}>
                <FontAwesome
                    name="user"
                    size={35}
                    color={muted}
                />
                <Text style={[styles.details, { color: text }]}>{video.coach_name}</Text>
            </View>
        </View>
    )
}

const RenderLink = (item: VideoRawType) => (
    <View style={styles.renderItem}>
        <ButtonSimple onPress={() => router.navigate(`/videos/preview/${item.slug}`)} text="Consulter la vidéo" color={Colors.black}  />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        minHeight: 84,
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },

    titleContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },

    cover: {
        height: 180,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 10,
    },

    detailsItem: {
        flex: 1,
        alignItems: 'center'
    },

    description: {
        fontSize: 14,
        marginBottom: 2,
        lineHeight: 20,
    },

    
    details: {
        fontSize: 13,
        marginTop: 5,
        fontWeight: '600',
    },

    label: {
        fontSize: 13,
        marginBottom: 5,
    },

    labelKey: {
        fontWeight: '700',
    },

    coach: {
        fontSize: 13,
    },

    renderItem: {
        paddingHorizontal: 12,
        paddingBottom: 16,
        paddingTop: 6,
    },

    separator: {
        backgroundColor: Colors.white,
        height: 2,
        width: '100%'
    },

    image: {
        flex: 1,
        resizeMode: 'cover',
    },

    spaceXs: {
        height: 4,
    },
})