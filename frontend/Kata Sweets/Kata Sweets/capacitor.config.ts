import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kata.sweets',
  appName: 'Kata Sweets',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'default', // Adapts to system theme (dark/light)
      backgroundColor: '#00000000', // Transparent
      overlaysWebView: true, // Overlay the webview
    },
  },
};

export default config;
