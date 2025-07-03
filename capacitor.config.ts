import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.voicesofjavadev',
  appName: 'Voices Of Java Dev',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // in ms
      backgroundColor: "#222831", // your brand color
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};


export default config;
