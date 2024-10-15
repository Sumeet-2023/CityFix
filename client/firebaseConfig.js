import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {initializeAuth, getReactNativePersistence} from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./envConfig";

// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//InitializeAuth persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})
const analytics = getAnalytics(app);

export { auth };