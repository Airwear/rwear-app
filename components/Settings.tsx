import React from "react";
import { View, Pressable, StyleSheet, Text, Alert, Switch, Platform, ActivityIndicator, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks";
import { useGuestGuard } from "@/hooks";
import GuestConversionModal from "./GuestConversionModal";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { cancelScheduledReminder, loadReminderSettings, saveReminderSettings, scheduleDailyReminder } from '@/utils/dailyReminder';
import { applyThemePreference, getThemePreference, setThemePreference } from '@/utils/themePreference';

type RowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    showChevron?: boolean;
    onPress?: () => void;
    rightControl?: React.ReactNode;
    danger?: boolean;
};

function SettingRow({
    icon,
    label,
    value,
    showChevron = true,
    onPress,
    rightControl,
    danger = false,
}: RowProps) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const surface = isDark ? '#121418' : Colors.white;
    const border = isDark ? '#2A2E34' : '#E9EDF2';
    const text = isDark ? Colors.white : '#1F1F1F';
    const muted = isDark ? '#9AA3AD' : '#5F6368';

    return (
        <Pressable
            android_ripple={{ color: border }}
            style={({ pressed }) => [
                styles.row,
                { backgroundColor: pressed ? (isDark ? '#1B2026' : '#F5F7FA') : surface },
            ]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.leftContent}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={danger ? '#D32F2F' : muted}
                    style={styles.rowIcon}
                />
                <Text style={[styles.rowLabel, { color: danger ? '#D32F2F' : text }]}>{label}</Text>
            </View>

            <View style={styles.rightContent}>
                {value ? <Text numberOfLines={1} style={[styles.rowValue, { color: muted }]}>{value}</Text> : null}
                {rightControl}
                {!rightControl && showChevron ? (
                    <Ionicons name="chevron-forward" size={17} color={isDark ? '#7E8792' : '#B0B4BB'} style={styles.chevron} />
                ) : null}
            </View>
        </Pressable>
    );
}

function SectionTitle({ title }: { title: string }) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    return <Text style={[styles.groupTitle, { color: isDark ? '#9AA3AD' : '#8C9096' }]}>{title}</Text>;
}

export default function Settings() {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const pageBg = isDark ? Colors.dark.background : Colors.light.background;
    const surface = isDark ? '#121418' : Colors.white;
    const border = isDark ? '#2A2E34' : '#E8EBEF';
    const muted = isDark ? '#9AA3AD' : '#9AA0A6';
    const { deleteAccount } = useAuth();
    const { requireAuth, guestModalVisible, closeGuestModal } = useGuestGuard();
    const [deleting, setDeleting] = React.useState(false);
    const router = useRouter();
    const [reminderEnabled, setReminderEnabled] = React.useState(false);
    const [reminderDate, setReminderDate] = React.useState<Date>(new Date());
    const [reminderId, setReminderId] = React.useState<string | null>(null);
    const [reminderBusy, setReminderBusy] = React.useState(false);
    const [showTimePickerIOS, setShowTimePickerIOS] = React.useState(false);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(isDark);

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

    React.useEffect(() => {
        let mounted = true;

        getThemePreference().then((preference) => {
            if (!mounted) return;
            if (preference === 'dark') {
                setDarkModeEnabled(true);
                return;
            }
            if (preference === 'light') {
                setDarkModeEnabled(false);
                return;
            }
            setDarkModeEnabled(isDark);
        });

        return () => {
            mounted = false;
        };
    }, [isDark]);

    const onToggleDarkMode = async (enabled: boolean) => {
        setDarkModeEnabled(enabled);
        const preference = enabled ? 'dark' : 'light';
        applyThemePreference(preference);
        await setThemePreference(preference);
    };

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

    return (
        <View style={[styles.container, { backgroundColor: pageBg }]}> 
            <SectionTitle title="COMPTE" />
            <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
                <SettingRow
                    icon="person-outline"
                    label="Mon compte"
                    value="Modifier"
                    onPress={() => requireAuth(() => router.push('/edit-user'))}
                />
            </View>

            <SectionTitle title="PREFERENCES" />
            <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
                <SettingRow
                    icon="moon-outline"
                    label="Mode sombre"
                    showChevron={false}
                    rightControl={
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={onToggleDarkMode}
                            trackColor={{ false: isDark ? '#3A414A' : '#DADCE0', true: '#A8DAB5' }}
                            thumbColor={darkModeEnabled ? '#1B873F' : '#FFFFFF'}
                        />
                    }
                />

                <View style={[styles.separator, { backgroundColor: border }]} />
                <SettingRow
                    icon="notifications-outline"
                    label="Rappel quotidien"
                    showChevron={false}
                    rightControl={
                        <Switch
                            value={reminderEnabled}
                            disabled={reminderBusy}
                            onValueChange={onToggleReminder}
                            trackColor={{ false: isDark ? '#3A414A' : '#DADCE0', true: '#A8DAB5' }}
                            thumbColor={reminderEnabled ? '#1B873F' : '#FFFFFF'}
                        />
                    }
                />

                {reminderEnabled ? (
                    <>
                        <View style={[styles.separator, { backgroundColor: border }]} />
                        <SettingRow
                            icon="time-outline"
                            label="Heure du rappel"
                            value={reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            onPress={onPickReminderTime}
                        />
                    </>
                ) : null}
            </View>

            {Platform.OS === 'ios' && showTimePickerIOS && (
                <View style={[styles.pickerCard, { backgroundColor: surface, borderColor: border }]}> 
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
                </View>
            )}

            <SectionTitle title="INFOS" />
            <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
                <SettingRow
                    icon="information-circle-outline"
                    label="Version logiciel"
                    value="v1.0.9"
                    onPress={() => router.push('/version')}
                />
            </View>

            <View style={styles.criticalActionWrap}>
                <Pressable
                    onPress={onDeletePress}
                    disabled={!deleteAccount || deleting}
                    style={({ pressed }) => [
                        styles.deleteButton,
                        (!deleteAccount || deleting) && styles.deleteButtonDisabled,
                        pressed && styles.deleteButtonPressed,
                    ]}
                >
                    {deleting ? <ActivityIndicator color="#D32F2F" /> : <Text style={styles.deleteText}>Supprimer mon compte</Text>}
                </Pressable>
                <Text style={[styles.deleteHint, { color: muted }]}>Cette action est irreversible.</Text>
            </View>

            <GuestConversionModal visible={guestModalVisible} onClose={closeGuestModal} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2,
    },
    groupTitle: {
        fontSize: 11,
        color: '#8C9096',
        letterSpacing: 0.9,
        marginBottom: 8,
        marginTop: 14,
        fontWeight: '600',
        paddingLeft: 2,
    },
    card: {
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: Platform.OS === 'android' ? 1 : 0,
    },
    row: {
        minHeight: 52,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '58%',
    },
    rowIcon: {
        marginRight: 12,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    rowLabelDanger: {
        color: '#D32F2F',
    },
    rowValue: {
        fontSize: 14,
        marginRight: 6,
        flexShrink: 1,
        textAlign: 'right',
    },
    chevron: {
        marginLeft: 2,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 46,
    },
    pickerCard: {
        marginTop: 8,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8EBEF',
        overflow: 'hidden',
    },
    criticalActionWrap: {
        marginTop: 18,
        alignItems: 'center',
    },
    deleteButton: {
        minHeight: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F4C7C7',
        backgroundColor: '#FFF5F5',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        minWidth: 180,
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    deleteButtonPressed: {
        opacity: 0.85,
    },
    deleteText: {
        color: '#D32F2F',
        fontWeight: '700',
        fontSize: 14,
    },
    deleteHint: {
        marginTop: 8,
        color: '#9AA0A6',
        fontSize: 12,
    },
})