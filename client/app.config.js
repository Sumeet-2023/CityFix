import 'dotenv/config';

export default {
  expo: {
    name: "client",
    slug: "client",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/play_store_512.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/SDG-11.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      usesCleartextTraffic: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/play_store_512.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ],
      package: "com.sumeettt69.client",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "32616bc5-514a-406b-83de-5e7d4115e284"
      },
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
      },
      openRouterApiKey: process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY,
      geoDbApiKey: process.env.EXPO_PUBLIC_GEO_DB_API_KEY,
      openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
      aqicnApiKey: process.env.EXPO_PUBLIC_AQICN_API_KEY,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      serverUrl: process.env.EXPO_PUBLIC_SERVER_URL
    }
  }
};
