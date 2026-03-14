import { View, StyleSheet, Text, Image } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Title from "@/components/Title";
import { ButtonSimple } from "@/components/buttons";

export default function Video(video: VideoRawType) {
    return (
        <View style={styles.container}>
            <View style={styles.cover}>
                <Image style={styles.image} source={{uri: video.cover}} />
            </View>
            <Details {...video} />
            <View style={styles.titleContainer}>
                <Title size={21} text={video.designation.toUpperCase()} weight="bold" push={4} />
                <Text style={styles.label}><Text style={styles.labelKey}>Coach :</Text> {video.coach_name}</Text>
                <Text style={styles.label}><Text style={styles.labelKey}>Niveau :</Text> {video.level_name}</Text>
                <Text style={styles.label}><Text style={styles.labelKey}>Matériels :</Text> {video.materiel_list}</Text>
                <View style={styles.spaceXs} />
                <Text style={styles.description}>{video.description}</Text>
            </View>
            <RenderLink {...video} />
        </View>
    )
}


function Details(video: VideoRawType) {
    return (
        <View style={styles.detailsContainer}>
            <View style={styles.detailsItem}>
                <FontAwesome
                    name="calendar"
                    size={35}
                    color={Colors.muted}
                />
                <Text style={styles.details}>{video.duration_in_text}</Text>
            </View>

            <View style={styles.detailsItem}>
                <FontAwesome
                    name="list"
                    size={35}
                    color={Colors.muted}
                />
                <Text style={styles.details}>{video.level_name}</Text>
            </View>

            <View style={styles.detailsItem}>
                <FontAwesome
                    name="user"
                    size={35}
                    color={Colors.muted}
                />
                <Text style={styles.details}>{video.coach_name}</Text>
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
        backgroundColor: Colors.white,
    },

    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        minHeight: 84,
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eceef2',
        backgroundColor: '#fcfcfd',
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
        color: Colors.darkColor,
        fontSize: 14,
        marginBottom: 2,
        lineHeight: 20,
    },

    
    details: {
        fontSize: 13,
        marginTop: 5,
        fontWeight: '600',
        color: Colors.darkColor,
    },

    label: {
        fontSize: 13,
        marginBottom: 5,
        color: Colors.darkColor,
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