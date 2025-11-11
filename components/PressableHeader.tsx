import React from 'react';
import { StyleSheet, Pressable } from 'react-native';



export default function PressableHeader({children, onPress}: any) {
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      {({ pressed }) => (
        <>{children}</>
      )}
      
    </Pressable>
  );
}

const styles = StyleSheet.create({

  pressable : {
    width: 45, 
    height: 30, 
    justifyContent:'center', 
    alignItems: 'center'
  }
});

