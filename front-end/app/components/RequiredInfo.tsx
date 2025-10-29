// Loader.js
import Colors from '@/constants/Colors';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';



export default function RequiredInfo() {
  return (
    <View style={styles.container}>
      <Text>Les champs marqués </Text>
      <Text style={styles.required}>(*)</Text>
      <Text> sont obligatoires</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row', 
    marginVertical: 16
  },

  required: {
    color: Colors.danger
  },
});

