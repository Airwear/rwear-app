import { View, Pressable, StyleSheet, Text, Image } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Title from "@/components/Title";
import { ButtonSimple } from "@/components/buttons";

export default function Video(video: VideoRawType) {

    const onSelect = (data: VideoRawType) => {
        
    }
    return (
        <View style={styles.container}>
            <View style={styles.cover}>
                <Image style={styles.image} source={{uri: video.cover}} />
            </View>
            <Details {...video} />
            <View style={styles.titleContainer}>
                <Title size={20} text={video.designation.toUpperCase()} weight="bold" push={4} />
                <Text style={styles.label}>Coach : {video.coach_name}</Text>
                <Text style={styles.label}>Niveau : {video.level_name}</Text>
                <Text style={styles.label}>Matériels : {video.materiel_list}</Text>
                <View style={{height: 4}} />
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
        <ButtonSimple onPress={() => router.navigate(`/videos/play/${item.slug}`)} text="Consulter la vidéo" color={Colors.black}  />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 80,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.muted
        //backgroundColor: '#f1f1f1'
    },

    titleContainer: {
        padding: 10,
    },

    cover: {
        height: 150,
    },

    detailsItem: {
        flex: 1,
        alignItems: 'center'
    },

    description: {
        color: Colors.black,
        fontSize: 15,
        marginBottom: 2
    },

    
    details: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: 'bold'
    },

    label: {
        fontSize: 13,
        marginBottom: 5
    },

    coach: {
        fontSize: 13,
    },

    renderItem: {
        padding: 10,
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
})