import { initializeApp } from "firebase/app";
// Only import getAnalytics when in a web environment
let getAnalytics;
if (typeof window !== "undefined") {
  getAnalytics = require("firebase/analytics").getAnalytics;
}

import { initializeAuth } from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID
const measurementId = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID

// Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Conditionally initialize Analytics
let analytics;
if (getAnalytics) {
  const { isSupported } = require("firebase/analytics"); // Ensure this is imported when using in a web environment

  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  }).catch((error) => {
    console.error("Error checking analytics support:", error);
  });
}

export { auth, analytics };