declare module 'react-native-google-cast' {
  import * as React from 'react';
  import { ViewStyle } from 'react-native';

  export const CastButton: React.ComponentType<{ style?: ViewStyle }>;
  export const CastMiniController: React.ComponentType<{ style?: ViewStyle }>;

  export enum CastState {
    NO_DEVICES_AVAILABLE,
    NOT_CONNECTED,
    CONNECTING,
    CONNECTED,
  }

  export default class GoogleCast {
    static getCastState(): Promise<CastState>;
    static castMedia(options: {
      mediaUrl: string;
      title?: string;
      subtitle?: string;
      contentType?: string;
      streamDuration?: number;
    }): void;
    static EventEmitter: any;
    static SESSION_STARTED: string;
    static SESSION_ENDED: string;
  }
}