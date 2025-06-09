import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCD7EuAjk65S_nOljR7Kda_t7BbMANco9s",
    authDomain: "buzzing-chat-app.firebaseapp.com",
    projectId: "buzzing-chat-app",
    storageBucket: "buzzing-chat-app.firebasestorage.app",
    messagingSenderId: "382017358182",
    appId: "1:382017358182:web:43b93880912d88d76aa0a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const storage = getStorage(app);


export const auth = getAuth(app);