import { View, FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SettingType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const _data: SettingType[] = [
    {
        title: "Mon compte",
        description: "Complétez les informations relatives à votre compte, et profitez de l'ensemble des fonctionnalités",
        url: 'edit-user',
        key: "account",
    },
    
    /*{
        title: "Conditions d'utilisation",
        description: "Consultez nos conditions d'utilisation et paramètres de confidentialité",
        url: 'policy',
        key: "policy",
    },*/

    {
        title: "Version logiciel",
        description: "Consultez les informations relatives à la version de votre applications",
        url: 'version',
        key: "version",
    },
]

export default function Settings() {

    const renderItem = ({ item }: any) => (
        <Link href={item.url} asChild>
            <Pressable style={({ pressed }) => [styles.renderItem, pressed && styles.renderItemPressed]}>
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>

                <View style={styles.buttonIcon}>
                    <FontAwesome
                        name="chevron-right"
                        size={20}
                        color={Colors.muted}
                    />
                </View>
            </Pressable>
        </Link>
    );

    const separator = () => <View style={styles.separator} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={_data}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                ItemSeparatorComponent={separator}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    listContainer: {
        paddingTop: 6,
        paddingHorizontal: 2,
    },

    content: {
        flex: 1,
    },

    description: {
        color: Colors.muted,
        fontSize: 13,
        lineHeight: 18,
    },

    title: {
        fontSize: 17,
        marginBottom: 6,
        color: Colors.darkColor,
        fontWeight: '700',
    },

    renderItem: {
        minHeight: 96,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: 'row',
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#eceef2',
    },

    renderItemPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.995 }],
    },

    separator: {
        backgroundColor: Colors.white,
        width: '100%',
        height: 8,
    },
    buttonIcon: {
        width: 40,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
})