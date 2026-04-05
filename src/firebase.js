// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXEhJ_oSdVdS7C0Nl25P0u82RAh5N1Hh8",
  authDomain: "room-monitoring-2f8cf.firebaseapp.com",
  databaseURL: "https://room-monitoring-2f8cf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "room-monitoring-2f8cf",
  storageBucket: "room-monitoring-2f8cf.firebasestorage.app",
  messagingSenderId: "950923701842",
  appId: "1:950923701842:web:a002c9a3e37905acffb98b",
  measurementId: "G-PCYCCFTRQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);