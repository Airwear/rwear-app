import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { user, deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

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
      <Text style={styles.title}>Parametres</Text>
      {user?.email ? (
        <Text style={styles.subtitle}>Connecte en tant que {user.email}</Text>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        {/* Bouton principal pour la suppression de compte */}
        <Pressable
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
          onPress={confirmDelete}
          disabled={isDeleting}
        >
          <View style={styles.deleteContent}>
            {isDeleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteText}>Supprimer mon compte</Text>
            )}
          </View>
        </Pressable>
        <Text style={styles.deleteHint}>
          Cette action est irreversible.
        </Text>
      </View>

      <Text style={styles.signature}>By Dominik</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  deleteButton: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  deleteButtonPressed: { opacity: 0.8 },
  deleteContent: { alignItems: 'center' },
  deleteText: { color: '#fff', fontWeight: '600' },
  deleteHint: { marginTop: 8, color: '#999', fontSize: 12 },
  signature: { marginTop: 24, textAlign: 'center', color: '#aaa', fontSize: 12 },
});