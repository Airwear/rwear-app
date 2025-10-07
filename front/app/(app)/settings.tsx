import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { FlexContainer, Settings } from '@/components';
import Colors from '@/constants/Colors';

export default function TabSettingsScreen() {
  return (
    <FlexContainer color={Colors.white}>
      <Settings />
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
