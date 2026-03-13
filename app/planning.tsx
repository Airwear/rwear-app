import { StyleSheet, Text, View } from 'react-native';
import { FlexContainer, NotFound, } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect, } from 'react';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

export default function RegisterScreen() {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ 
      title: "Planning",
    });
  }, [navigation]);

  return (
    <FlexContainer color={Colors.white} push>
      <View style={styles.heroCard}>
        <View style={styles.headerRow}>
          <FontAwesome name="calendar" size={18} color={Colors.darkColor} />
          <Text style={styles.title}>Planning</Text>
        </View>
        <Text style={styles.subtitle}>Organisez vos entraînements à venir</Text>
      </View>
      <NotFound />
    </FlexContainer>
  );
}

const styles = StyleSheet.create({

  heroCard: {
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
    fontSize: 13,
    marginTop: 4,
  }
});
