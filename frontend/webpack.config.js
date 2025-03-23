const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-maps': 'react-native-web-maps',
  };

  // Add fallbacks for native modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.ios': false,
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo.android': false,
  };
  
  return config;
}; 