import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Initialize Status Bar for mobile apps
const initializeStatusBar = async () => {
  try {
    // Check if running on native platform
    if (Capacitor.isNativePlatform()) {
      // Make status bar overlay the webview (transparent)
      await StatusBar.setOverlaysWebView({ overlay: true });
      // Use Default style to adapt to system theme (dark/light)
      await StatusBar.setStyle({ style: Style.Default });
      // Set background to transparent
      await StatusBar.setBackgroundColor({ color: '#00000000' });
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [StatusBar] Status bar configured as transparent and adaptive');
      }
    }
  } catch (error) {
    // Fail silently if StatusBar is not available (web browser)
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️ [StatusBar] StatusBar not available (running in browser)');
    }
  }
};

// Initialize status bar
initializeStatusBar();

createRoot(document.getElementById("root")!).render(<App />);
