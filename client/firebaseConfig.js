import { initializeApp } from "firebase/app";
// Only import getAnalytics when in a web environment
let getAnalytics;
if (typeof window !== "undefined") {
  getAnalytics = require("firebase/analytics").getAnalytics;
}

import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

export const openroutekey = process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;
export const serverurl = process.env.EXPO_PUBLIC_SERVER_URL;

// Firebase configuration
const firebaseConfig = {
  apiKey : "AIzaSyDU4BqoEEoB66yHp0nUmGf4E7--tlZqiiE",
  authDomain: "cityfix-6bb77.firebaseapp.com",
  projectId: "cityfix-6bb77",
  storageBucket: "cityfix-6bb77.appspot.com",
  messagingSenderId: "977982530617",
  appId: "1:977982530617:web:e1e63d88c64539ede359e8",
  measurementId: "G-8JFBFH65NJ",
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

export const db = getFirestore(app);

export { auth, analytics };