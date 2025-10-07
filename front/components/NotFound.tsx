// Loader.js
import Colors from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotFound = () => {
    
  return (
    <View style={styles.content}>
      <Text style={styles.text}>Aucun élément trouvé</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 16,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: Colors.muted,
    fontStyle: 'italic'
  },
});

export default NotFound;
