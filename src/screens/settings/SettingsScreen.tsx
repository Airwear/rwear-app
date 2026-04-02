import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

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
  return (
    <Pressable
      android_ripple={{ color: '#EEF1F4' }}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? '#D32F2F' : '#5F6368'}
          style={styles.rowIcon}
        />
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      </View>

      <View style={styles.rightContent}>
        {value ? <Text numberOfLines={1} style={styles.rowValue}>{value}</Text> : null}
        {rightControl}
        {!rightControl && showChevron ? (
          <Ionicons name="chevron-forward" size={17} color="#B0B4BB" style={styles.chevron} />
        ) : null}
      </View>
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.groupTitle}>{title}</Text>;
}

export default function SettingsScreen() {
  const { user, deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [reminderIndex, setReminderIndex] = useState(0);

  const reminderOptions = useMemo(() => ['07:00', '08:00', '12:00', '18:00', '20:00'], []);
  const reminderTime = reminderOptions[reminderIndex];

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleReminder = (value: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDailyReminderEnabled(value);
  };

  const cycleReminderTime = () => {
    setReminderIndex((prev) => (prev + 1) % reminderOptions.length);
  };

  // Appelle l'API et gere l'etat de chargement lors de la suppression du compte
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible de supprimer le compte pour le moment. Reessayez plus tard.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Demande une confirmation explicite avant l'action destructrice
  const confirmDelete = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est definitive et supprimera toutes vos donnees. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: handleDeleteAccount },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Parametres</Text>

        <SectionTitle title="COMPTE" />
        <View style={styles.card}>
          <SettingRow
            icon="person-outline"
            label="Compte"
            value={user?.email || 'Non connecte'}
            onPress={() => {}}
          />
          <View style={styles.separator} />
          <SettingRow icon="shield-checkmark-outline" label="Confidentialite" onPress={() => {}} />
        </View>

        <SectionTitle title="PREFERENCES" />
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Rappel quotidien"
            showChevron={false}
            rightControl={
              <Switch
                value={dailyReminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ false: '#DADCE0', true: '#A8DAB5' }}
                thumbColor={dailyReminderEnabled ? '#1B873F' : '#FFFFFF'}
              />
            }
          />

          {dailyReminderEnabled ? (
            <>
              <View style={styles.separator} />
              <SettingRow
                icon="time-outline"
                label="Heure du rappel"
                value={reminderTime}
                onPress={cycleReminderTime}
              />
            </>
          ) : null}

          <View style={styles.separator} />
          <SettingRow icon="language-outline" label="Langue" value="Francais" onPress={() => {}} />
        </View>

        <SectionTitle title="INFOS" />
        <View style={styles.card}>
          <SettingRow icon="help-circle-outline" label="Aide" onPress={() => {}} />
          <View style={styles.separator} />
          <SettingRow icon="information-circle-outline" label="A propos" value="v1.0.9" onPress={() => {}} />
        </View>

        <View style={styles.criticalActionWrap}>
        <Pressable
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
          onPress={confirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <ActivityIndicator color="#D32F2F" /> : <Text style={styles.deleteText}>Supprimer mon compte</Text>}
        </Pressable>
        <Text style={styles.deleteHint}>Cette action est irreversible.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 34,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 14,
    marginTop: Platform.OS === 'ios' ? 4 : 2,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECEFF3',
    ...Platform.select({
      ios: {
        shadowColor: '#0D1B2A',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
  row: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowPressed: {
    backgroundColor: '#F8F9FB',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    color: '#1F1F1F',
    fontSize: 15.5,
  },
  rowLabelDanger: {
    color: '#D32F2F',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  rowValue: {
    color: '#7B8088',
    fontSize: 14,
    marginRight: 6,
    maxWidth: 170,
    textAlign: 'right',
  },
  chevron: {
    marginLeft: 2,
  },
  separator: {
    height: 1,
    marginLeft: 48,
    backgroundColor: '#EEF1F4',
  },
  criticalActionWrap: {
    marginTop: 24,
    alignItems: 'stretch',
  },
  deleteButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1C7C7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  deleteButtonPressed: {
    opacity: 0.75,
  },
  deleteText: {
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: 15,
  },
  deleteHint: {
    marginTop: 8,
    color: '#9AA0A7',
    fontSize: 12,
  },
});