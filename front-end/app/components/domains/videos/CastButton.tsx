import React from 'react';
import { CastButton as GoogleCastButton } from 'react-native-google-cast';
import { StyleProp, ViewStyle } from 'react-native';

interface CastButtonProps {
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  color?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoSubtitle?: string;
  thumbnailUrl?: string;
  duration?: number;
}

export const CastButton: React.FC<CastButtonProps> = ({ style, tintColor = '#FFFFFF', color }) => {
  return <GoogleCastButton style={{ width: 24, height: 24, tintColor: color || tintColor, ...(style as any) }} />;
};
