import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'tultolrial-capacitor',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:3000',
    cleartext: true
  }
  // server: {
  //   androidScheme: 'https'
  // }
};

export default config;
