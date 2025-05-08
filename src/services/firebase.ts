// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA02AMtIMGSG_5VU8NuRX5s3oK6uHlOGiI",
  authDomain: "mathgeon.firebaseapp.com",
  databaseURL: "https://mathgeon-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mathgeon",
  storageBucket: "mathgeon.firebasestorage.app",
  messagingSenderId: "1086592210908",
  appId: "1:1086592210908:web:20d701fb47894984f82119",
  measurementId: "G-5Q6G9ZZNEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
