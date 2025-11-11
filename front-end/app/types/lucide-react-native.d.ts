declare module 'lucide-react-native' {
  import { FC } from 'react';
  import { SvgProps } from 'react-native-svg';

  interface IconProps extends SvgProps {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export const Play: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Flame: FC<IconProps>;
}