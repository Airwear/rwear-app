import React from "react";
import { View, FlatList, Pressable, StyleSheet, Text, Alert, Switch, Platform } from "react-native";
import { SettingType } from "@/utils/type-def";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/hooks";
import { useGuestGuard } from "@/hooks";
import GuestConversionModal from "./GuestConversionModal";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { cancelScheduledReminder, loadReminderSettings, saveReminderSettings, scheduleDailyReminder } from '@/utils/dailyReminder';

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
    const { deleteAccount } = useAuth();
    const { requireAuth, guestModalVisible, closeGuestModal } = useGuestGuard();
    const [deleting, setDeleting] = React.useState(false);
    const router = useRouter();
    const [reminderEnabled, setReminderEnabled] = React.useState(false);
    const [reminderDate, setReminderDate] = React.useState<Date>(new Date());
    const [reminderId, setReminderId] = React.useState<string | null>(null);
    const [reminderBusy, setReminderBusy] = React.useState(false);
    const [showTimePickerIOS, setShowTimePickerIOS] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;
        loadReminderSettings().then((settings) => {
            if (!mounted) return;
            setReminderEnabled(settings.enabled);
            setReminderId(settings.notificationId);
            const date = new Date();
            date.setHours(settings.hour, settings.minute, 0, 0);
            setReminderDate(date);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const onDeletePress = () => {
        requireAuth(() => {
        Alert.alert(
            "Suppression du compte",
            "Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        if (!deleteAccount) return;
                        try {
                            setDeleting(true);
                            await deleteAccount();
                        } catch {
                            Alert.alert("Erreur", "Impossible de supprimer le compte pour le moment.");
                        } finally {
                            setDeleting(false);
                        }
                    }
                }
            ]
        );
        });
    };

    const persistReminder = async (enabled: boolean, date: Date, notificationId: string | null) => {
        await saveReminderSettings({
            enabled,
            hour: date.getHours(),
            minute: date.getMinutes(),
            notificationId,
        });
    };

    const onToggleReminder = async (nextEnabled: boolean) => {
        if (reminderBusy) return;
        setReminderBusy(true);
        try {
            if (nextEnabled) {
                const id = await scheduleDailyReminder(reminderDate.getHours(), reminderDate.getMinutes());
                if (!id) {
                    Alert.alert('Notifications', "L'autorisation de notifications est requise pour activer le rappel.");
                    return;
                }
                setReminderEnabled(true);
                setReminderId(id);
                await persistReminder(true, reminderDate, id);
            } else {
                await cancelScheduledReminder(reminderId);
                setReminderEnabled(false);
                setReminderId(null);
                await persistReminder(false, reminderDate, null);
            }
        } finally {
            setReminderBusy(false);
        }
    };

    const applySelectedTime = async (selected: Date) => {
        const next = new Date(reminderDate);
        next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
        setReminderDate(next);

        if (reminderEnabled) {
            setReminderBusy(true);
            try {
                await cancelScheduledReminder(reminderId);
                const newId = await scheduleDailyReminder(next.getHours(), next.getMinutes());
                if (!newId) {
                    Alert.alert('Notifications', "Impossible de reprogrammer le rappel sans autorisation notifications.");
                    setReminderEnabled(false);
                    setReminderId(null);
                    await persistReminder(false, next, null);
                    return;
                }
                setReminderId(newId);
                await persistReminder(true, next, newId);
            } finally {
                setReminderBusy(false);
            }
        } else {
            await persistReminder(false, next, null);
        }
    };

    const onPickReminderTime = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: reminderDate,
                mode: 'time',
                is24Hour: true,
                onChange: (_event, selectedDate) => {
                    if (selectedDate) {
                        applySelectedTime(selectedDate);
                    }
                },
            });
            return;
        }
        setShowTimePickerIOS((prev) => !prev);
    };

    const renderItem = ({ item }: any) => {
        const isSensitive = item.key === 'account';
        if (isSensitive) {
            return (
                <Pressable
                    style={({ pressed }) => [styles.renderItem, pressed && styles.renderItemPressed]}
                    onPress={() => requireAuth(() => router.push('/edit-user'))}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <View style={styles.buttonIcon}>
                        <FontAwesome name="chevron-right" size={20} color={Colors.muted} />
                    </View>
                </Pressable>
            );
        }
        return (
            <Link href={item.url} asChild>
                <Pressable style={({ pressed }) => [styles.renderItem, pressed && styles.renderItemPressed]}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <View style={styles.buttonIcon}>
                        <FontAwesome name="chevron-right" size={20} color={Colors.muted} />
                    </View>
                </Pressable>
            </Link>
        );
    };

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

            <View style={styles.reminderCard}>
                <View style={styles.reminderTopRow}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Rappel quotidien</Text>
                        <Text style={styles.description}>Recevez une notification locale chaque jour.</Text>
                    </View>
                    <Switch
                        value={reminderEnabled}
                        disabled={reminderBusy}
                        onValueChange={onToggleReminder}
                        trackColor={{ false: '#d1d5db', true: '#86efac' }}
                        thumbColor={reminderEnabled ? '#166534' : '#f9fafb'}
                    />
                </View>

                <Pressable
                    onPress={onPickReminderTime}
                    style={({ pressed }) => [styles.timeButton, pressed && styles.timeButtonPressed]}
                >
                    <Text style={styles.timeLabel}>Heure du rappel</Text>
                    <Text style={styles.timeValue}>
                        {reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </Pressable>

                {Platform.OS === 'ios' && showTimePickerIOS && (
                    <DateTimePicker
                        value={reminderDate}
                        mode="time"
                        is24Hour
                        display="spinner"
                        onChange={(_event, selectedDate) => {
                            if (selectedDate) {
                                applySelectedTime(selectedDate);
                            }
                        }}
                    />
                )}
            </View>

            <Pressable
                onPress={onDeletePress}
                disabled={!deleteAccount || deleting}
                style={({ pressed }) => [
                    styles.deleteButton,
                    (!deleteAccount || deleting) && styles.deleteButtonDisabled,
                    pressed && styles.deleteButtonPressed,
                ]}
            >
                <Text style={styles.deleteText}>{deleting ? "Suppression..." : "Supprimer mon compte"}</Text>
            </Pressable>

            <GuestConversionModal visible={guestModalVisible} onClose={closeGuestModal} />
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
    reminderCard: {
        marginTop: 8,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#eceef2',
    },
    reminderTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    timeButton: {
        marginTop: 12,
        minHeight: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    timeButtonPressed: {
        opacity: 0.9,
    },
    timeLabel: {
        color: Colors.muted,
        fontSize: 13,
        fontWeight: '600',
    },
    timeValue: {
        color: Colors.darkColor,
        fontSize: 15,
        fontWeight: '700',
    },
    buttonIcon: {
        width: 40,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    deleteButton: {
        marginTop: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#fecaca',
        backgroundColor: '#991b1b',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    deleteButtonPressed: {
        opacity: 0.85,
    },
    deleteText: {
        color: '#fee2e2',
        fontWeight: '700',
        fontSize: 14,
    }
})