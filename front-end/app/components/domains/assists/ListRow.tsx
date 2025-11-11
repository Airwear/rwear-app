import React from 'react';
import { View, Text } from 'react-native';

export default function ListRow({ children }: { children?: React.ReactNode }) {
  return (
    <View>
      <Text>ListRow placeholder</Text>
      {children}
    </View>
  );
}
