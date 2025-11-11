declare module 'react-native-video' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface VideoProperties extends ViewProps {
    source: { uri: string } | number;
    style?: any;
    controls?: boolean;
    resizeMode?: 'contain' | 'cover' | 'stretch';
    repeat?: boolean;
    paused?: boolean;
    muted?: boolean;
    volume?: number;
    rate?: number;
    playInBackground?: boolean;
    playWhenInactive?: boolean;
    ignoreSilentSwitch?: 'ignore' | 'obey';
    disableFocus?: boolean;
    fullscreen?: boolean;
    progressUpdateInterval?: number;
    onLoadStart?: () => void;
    onLoad?: (data: any) => void;
    onProgress?: (data: any) => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
    onBuffer?: (isBuffering: boolean) => void;
    onFullscreenPlayerWillPresent?: () => void;
    onFullscreenPlayerDidPresent?: () => void;
    onFullscreenPlayerWillDismiss?: () => void;
    onFullscreenPlayerDidDismiss?: () => void;
    shouldPlay?: boolean;
    onPlaybackResume?: () => void;
  }

  export default class Video extends Component<VideoProperties> {}
}