import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FlexContainer ({children, color, push = false}: any) {
  const scheme = useColorScheme();
  const defaultBg = scheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const bg = color !== undefined ? color : defaultBg;

  let variants: any = { backgroundColor: bg };

  if (push) {
    variants['padding'] = 16;
  }

  return (
    <SafeAreaView style={[styles.container, variants]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});