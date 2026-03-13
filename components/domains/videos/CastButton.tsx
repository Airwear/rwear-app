import React from 'react';
import { CastButton as GoogleCastButton } from 'react-native-google-cast';
import { StyleProp, ViewStyle } from 'react-native';

interface CastButtonProps {
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
}

export const CastButton: React.FC<CastButtonProps> = ({ style, tintColor = '#FFFFFF' }) => {
  return <GoogleCastButton style={[{ width: 24, height: 24 }, style]} tintColor={tintColor} />;
};
