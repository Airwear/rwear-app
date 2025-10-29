import { StyleSheet, View } from 'react-native';

export default function Separator () {
    return <View style={styles.separator} />
}

const styles = StyleSheet.create({
    separator: {
      marginVertical: 30,
      height: 1,
      width: '90%',
      backgroundColor: 'rgba(255,255,255,0.4)'
    },
  });