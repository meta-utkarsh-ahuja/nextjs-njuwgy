const { DefinePlugin } = require('webpack');

function withExpo(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      // Mix in aliases
      if (!config.resolve) {
        config.resolve = {};
      }

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Alias direct react-native imports to react-native-web
        'react-native$': 'react-native-web',
        // Alias internal react-native modules to react-native-web
        'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
          'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
        'react-native/Libraries/vendor/emitter/EventEmitter$':
          'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
        'react-native/Libraries/EventEmitter/NativeEventEmitter$':
          'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      };

      config.resolve.extensions = [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        ...(config.resolve?.extensions ?? []),
      ];

      if (!config.plugins) {
        config.plugins = [];
      }

      // Expose __DEV__ from Metro.
      config.plugins.push(
        new DefinePlugin({
          // fix: https://github.com/software-mansion/react-native-reanimated/pull/4141
          __DEV__: false,
        })
      );

      // Execute the user-defined webpack config.
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}

module.exports = withExpo({
  /** @type {import('next').NextConfig} */
  transpilePackages: ['moti', 'react-native-reanimated', 'react-native'],
});
