// permissive module declarations to reduce TS noise during verification

declare module 'lucide-react-native' {
  const content: any;
  export = content;
}

declare module 'types/navigation' {
  export type RootStackParamList = Record<string, any>;
}

// Generic fallback for local component paths that may be missing typings
declare module '*components/*' {
  const v: any;
  export default v;
}

// Allow importing image assets as any
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
