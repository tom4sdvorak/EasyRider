// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ3aRDfuowCJslfhGpuOR9MQWNvrFYGfc",
  authDomain: "cross-platform-labworks.firebaseapp.com",
  projectId: "cross-platform-labworks",
  storageBucket: "cross-platform-labworks.firebasestorage.app",
  messagingSenderId: "668960007228",
  appId: "1:668960007228:web:b6f8fcc1c6ce0d8eaccf39",
  measurementId: "G-B7BPM1GXMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };