import { FlexContainer, ImageViewer, Title} from '@/components';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { _get, } from '@/services/api';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { icons } from '@/utils';

export default function TabPodometreScreen() {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stepLast24h = 'Étapes effectuées au cours des dernières 24 heures';
  const stepDescription = "L'activité physique permet en effet de réduire une surcharge pondérale, de contrôler la glycémie (sucre dans le sang), la tension artérielle et le cholesterol. Il est ainsi recommandé de pratiquer au moins 30 minutes d'exercice modérée 3 fois par semaine.";

  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission refusée pour le podomètre');
          Alert.alert('Permission requise', 'Autorisation requise pour suivre vos pas');
          return false;
        }
        return true;
      } catch (e) {
        console.warn('Permission request error:', e);
        return true; // Fallback
      }
    }
    return true;
  };

  const subscribe = async () => {
    try {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        setIsPedometerAvailable('denied');
        return;
      }

      const isAvailable = await Pedometer.isAvailableAsync();

      setIsPedometerAvailable(String(isAvailable));

      if (!isAvailable) {
        setError('Podomètre non disponible sur cet appareil');
        return;
      }

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);

      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
        setCurrentStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(prevState => prevState + result.steps);
      });
    } catch (err) {
      console.error('Erreur podomètre:', err);
      setError('Erreur lors de l\'initialisation du podomètre');
      setIsPedometerAvailable('error');
    }
  };

  useEffect(() => {

    let subscription: any;

    const subscribeAsync = async () => {
      subscription = await subscribe();
    };

    subscribeAsync();
    
    return () => subscription && subscription.remove();
  }, []);

  return (
    <FlexContainer color={Colors.white} push>

      <View style={styles.container}>

        <ImageViewer 
          placeholderImageSource={icons.podometre} 
          width={350}
          height={150}
        />

        <View style={{marginBottom: 16}} />
          {error ? (
            <Title text={error} color={Colors.danger} weight='bold' align='center' size={18} />
          ) : (
            <>
              <Title text={stepLast24h.toLocaleUpperCase()} weight='bold' align='center' />
              <Title text={String(currentStepCount)} color={Colors.danger} weight='bold' align='center' size={75} />
              <Title text={stepDescription} size={15} align='center' color={Colors.muted} />
            </>
          )}
        </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});