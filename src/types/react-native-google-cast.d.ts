declare module 'react-native-google-cast' {
  import * as React from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  export const CastButton: React.ComponentType<{
    style?: StyleProp<ViewStyle>;
    tintColor?: string;
    accessibilityLabel?: string;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  }>;
  export const CastMiniController: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  export const CastContext: any;
  export type CastSession = any;
  export type MediaMetadata = any;
  export type MediaType = any;
  export const MediaType: { MOVIE: string };
  export type SessionManager = any;
  export function useRemoteMediaClient(): any;
  export function useCastState(): CastState;
  export function onCastStateChanged(cb: (state: CastState) => void): { remove: () => void };

  export enum CastState {
    NO_DEVICES_AVAILABLE,
    NOT_CONNECTED,
    CONNECTING,
    CONNECTED,
  }

  export default class GoogleCast {
    static getCastState(): Promise<CastState>;
    static castMedia(options: any): void;
    static EventEmitter: any;
    static CAST_STATE_CHANGED: string;
    static RECEIVER_APP_ID: string;
    static RECEIVER_ID_CAST_VIDEOS: string;
    static SESSION_STARTED: string;
    static SESSION_ENDED: string;
    static setCastOptions(options: any): Promise<void> | void;
    static showCastDialog(): Promise<boolean>;
    static getCastSession(): Promise<CastSession | null> | CastSession | null;
    static getSessionManager(): Promise<SessionManager>;
    static pause(): Promise<void>;
    static play(): Promise<void>;
    static stop(): Promise<void>;
    static seek(position: number): Promise<void>;
    static onCastStateChanged(cb: (state: CastState) => void): { remove: () => void };
  }
}