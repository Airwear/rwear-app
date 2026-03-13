declare module 'react-native-google-cast' {
  import * as React from 'react';
  import { EmitterSubscription, StyleProp, ViewStyle } from 'react-native';

  export enum CastState {
    NO_DEVICES_AVAILABLE = 'NoDevicesAvailable',
    NOT_CONNECTED = 'NotConnected',
    CONNECTING = 'Connecting',
    CONNECTED = 'Connected',
  }

  export interface MediaInfo {
    contentUrl?: string;
    contentType?: string;
    metadata?: {
      title?: string;
      subtitle?: string;
      images?: Array<{ url: string }>;
      type?: any;
    };
    [key: string]: any;
  }

  export type CastSession = any;
  export type MediaMetadata = any;
  export type MediaType = any;
  export const MediaType: { MOVIE: string };
  export type SessionManager = any;

  export const CastButton: React.ComponentType<{
    style?: StyleProp<ViewStyle>;
    tintColor?: string;
    accessibilityLabel?: string;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  }>;
  export const CastMiniController: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  export const CastContext: any;
  export function useRemoteMediaClient(): any;
  export function useCastState(): CastState;
  export function onCastStateChanged(cb: (state: CastState) => void): { remove: () => void };

  export default class GoogleCast {
    static EventEmitter: {
      addListener(event: string, callback: (state: CastState) => void): EmitterSubscription;
      removeAllListeners(): void;
    };
    static CAST_STATE_CHANGED: string;
    static RECEIVER_APP_ID: string;
    static RECEIVER_ID_CAST_VIDEOS: string;
    static SESSION_STARTED: string;
    static SESSION_ENDED: string;
    static getCastState(): Promise<CastState>;
    static castMedia(mediaInfo: MediaInfo): Promise<void>;
    static setCastOptions(options: any): Promise<void> | void;
    static showCastDialog(): Promise<boolean>;
    static getCastSession(): Promise<CastSession | null> | CastSession | null;
    static getSessionManager(): Promise<SessionManager>;
    static pause(): Promise<void>;
    static play(): Promise<void>;
    static stop(): Promise<void>;
    static seek(position: number): Promise<void>;
    static onCastStateChanged(cb: (state: CastState) => void): { remove: () => void };
    static endSession(): Promise<void>;
  }
}
