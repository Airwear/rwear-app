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

    const renderItem = ({ item, index }: any) => (
        <Link href={item.url} asChild>
            <Pressable style={styles.renderItem}>
                <View style={{flex: 1}}>
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
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    description: {
        color: Colors.muted,
        fontSize: 12,
    },
    title: {
        fontSize: 18,
        marginBottom: 4
    },

    renderItem: {
        height: 90,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        flexDirection: 'row'
    },

    separator: {
        backgroundColor: Colors.lightColor,
        width: '100%',
        height: 1,
    },
    buttonIcon: {
        width: 40,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
})