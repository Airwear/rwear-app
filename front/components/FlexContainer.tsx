import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View} from 'react-native';

export default function FlexContainer ({children, color = Colors.white, push = false}: any) {

  let variants: any = {backgroundColor: color}

  if (push) {
    variants['padding'] = 16
  }

  return (
    <View style={[styles.container, {...variants}]}>
        {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightColor,
  },
});