declare module 'react-native-google-cast' {
  // Minimal, permissive typings to avoid blocking TS errors in the repo.
  // If you need stronger typing later, replace `any` with precise types.
  import { EmitterSubscription } from 'react-native';

  export type CastState = any;
  export type MediaInfo = any;

  export const CastButton: React.ComponentType<{ style?: any }>;
  export const CastStateChangedEvent: any;
  export const RECEIVER_APP_ID: any;
  export const RECEIVER_ID_CAST_VIDEOS: any;

  // Hooks / helpers
  export function useCastState(): any;
  export function useRemoteMediaClient(): any;

  export type SessionManager = any;
  export function getSessionManager(): Promise<SessionManager>;
  export function showCastDialog(): Promise<void>;
  export function castMedia(media: any): Promise<void>;
  export function setCastOptions(opts: any): void;
  export function endSession(): Promise<void>;
  export function onCastStateChanged(cb: (state: any) => void): { remove: () => void };

  const GoogleCast: any;
  export default GoogleCast;
}
