declare module 'react-native-google-cast' {
  import { EmitterSubscription } from 'react-native';

  export enum CastState {
    NO_DEVICES_AVAILABLE = 'NoDevicesAvailable',
    NOT_CONNECTED = 'NotConnected',
    CONNECTING = 'Connecting',
    CONNECTED = 'Connected',
  }

  export interface MediaInfo {
    contentUrl: string;
    contentType: string;
    metadata?: {
      title?: string;
      subtitle?: string;
      images?: Array<{ url: string }>;
    };
  }

  export interface CastButton extends React.Component<{
    style?: any;
  }> {}

  export default class GoogleCast {
    static EventEmitter: {
      addListener(event: string, callback: (state: CastState) => void): EmitterSubscription;
    };
    static CAST_STATE_CHANGED: string;
    static getCastState(): Promise<CastState>;
    static castMedia(mediaInfo: MediaInfo): Promise<void>;
    static endSession(): Promise<void>;
  }

  export { CastButton };
}
