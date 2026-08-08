const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Alias @ vers le dossier racine
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  ...config.resolver.extraNodeModules,
};

module.exports = config;
