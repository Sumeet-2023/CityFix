import { initializeApp } from "firebase/app";
// Only import getAnalytics when in a web environment
let getAnalytics;
if (typeof window !== "undefined") {
  getAnalytics = require("firebase/analytics").getAnalytics;
}

import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

// Environment variables for Firebase configuration
const {
  EXPO_PUBLIC_FIREBASE_API_KEY: apiKey,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: projectId,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  EXPO_PUBLIC_FIREBASE_APP_ID: appId,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: measurementId,
} = process.env;

export const openroutekey = process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;
export const serverurl = process.env.EXPO_PUBLIC_SERVER_URL;

// Firebase configuration
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

let analytics;
if (getAnalytics) {
  const { isSupported } = require("firebase/analytics");

  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      } else {
        console.warn("Firebase Analytics is not supported in this environment.");
      }
    })
    .catch((error) => {
      console.error("Error checking analytics support:", error);
    });
}

export { auth, analytics };