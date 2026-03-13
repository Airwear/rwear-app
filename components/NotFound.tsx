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
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  text: {
    fontSize: 16,
    color: Colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default NotFound;
