/**
 * Metro configuration for React Native
 * Uses Expo's default Metro configuration when present.
 */
try {
  const { getDefaultConfig } = require('expo/metro-config');
  module.exports = getDefaultConfig(__dirname);
} catch (e) {
  // Fallback to a minimal default when 'expo/metro-config' is not available.
  module.exports = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    },
  };
}
