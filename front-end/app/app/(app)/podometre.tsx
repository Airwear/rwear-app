import { FlexContainer, ImageViewer, Title} from '@/components';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { _get, } from '@/services/api';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import { icons } from '@/utils';

export default function TabPodometreScreen() {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const stepLast24h = 'Étapes effectuées au cours des dernières 24 heures';
  const stepDescription = "L’activité physique permet en effet de réduire une surcharge pondérale, de contrôler la glycémie (sucre dans le sang), la tension artérielle et le cholesterol. Il est ainsi recommandé de pratiquer au moins 30 minutes d’exercice modérée 3 fois par semaine.";

  const subscribe = async () => {
    
    const isAvailable = await Pedometer.isAvailableAsync();

    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      console.log(start, start.setDate(end.getDate() - 1))

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);

      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
        setCurrentStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(prevState => prevState + result.steps);
      });
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
          <Title text={stepLast24h.toLocaleUpperCase()} weight='bold' align='center' />
          <Title text={String(currentStepCount)} color={Colors.danger} weight='bold' align='center' size={75} />
          <Title text={stepDescription} size={15} align='center' color={Colors.muted} />
        </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});