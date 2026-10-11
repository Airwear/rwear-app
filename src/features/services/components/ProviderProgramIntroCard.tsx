import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

type Props = {
  title: string;
};

export function ProviderProgramIntroCard({ title }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <FontAwesome name="briefcase" color={Colors.orange} size={16} />
        </View>
        <Text style={[styles.title, { color: text }]}>{title}</Text>
      </View>

      <Text style={[styles.paragraph, { color: muted }]}>Rwear vous permet de proposer vos services à des utilisateurs qui recherchent un accompagnement de confiance.</Text>
      <Text style={[styles.paragraph, { color: muted }]}>Votre candidature est enregistrée puis soumise à une vérification avant toute activation d’un espace prestataire.</Text>
      <Text style={[styles.paragraph, { color: muted }]}>Soumettre ce formulaire ne garantit pas l’approbation automatique de votre profil.</Text>
      <Text style={[styles.notice, { color: Colors.danger }]}>Aucune validation administrative réelle n’est effectuée dans cette version locale.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF4E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  notice: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
});
