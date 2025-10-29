// Loader.js
import Colors from '@/constants/Colors';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ visible }: {visible: boolean}) => {
    
  if (!visible) return null;

  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={Colors.danger} />
    </View>
  );
};

export function Indicator({color = Colors.info}: {color?: string}) {
  return (
    <View style={styles.indicator}>
      <ActivityIndicator size='small' color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  indicator: {
  },
});

export default Loader;
