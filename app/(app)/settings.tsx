import { StyleSheet, View, Text } from 'react-native';
import { FlexContainer, Settings } from '@/components';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

export default function TabSettingsScreen() {
  return (
    <FlexContainer color={Colors.white}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <FontAwesome name="sliders" size={18} color={Colors.darkColor} />
          <Text style={styles.title}>Paramètres</Text>
        </View>
        <Text style={styles.subtitle}>Personnalisez votre espace et votre compte</Text>
      </View>
      <Settings />
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.darkColor,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.muted,
    marginTop: 4,
    fontSize: 13,
  }
});
