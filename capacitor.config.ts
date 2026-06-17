import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.justmadeid.nutritrack',
  appName: 'Nutri Track',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Uncomment baris di bawah untuk live reload saat development:
    // url: 'http://192.168.x.x:PORT',
    // cleartext: true,
    allowNavigation: [
      'nutri-track-ebon.vercel.app',
      '*.googleapis.com',
    ],
  },
  android: {
    allowMixedContent: false,
    buildOptions: {
      // keystorePath: 'nutri-track.keystore',   // uncomment saat release
      // keystoreAlias: 'nutritrack',
    }
  },
  plugins: {
    // Konfigurasi plugin Capacitor bisa ditambahkan di sini
  },
};

export default config;

