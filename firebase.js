// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase Konfigürasyonu (güncel bilgilerle)
const firebaseConfig = {
  apiKey: "AIzaSyBwwATHKjJbwUQT7sNEHl-fVJUAN0mNqpk",
  authDomain: "plugain.firebaseapp.com",
  databaseURL: "https://plugain-plus-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plugain",
  storageBucket: "plugain.appspot.com",
  messagingSenderId: "693636169295",
  appId: "1:693636169295:web:fc965cea5bfe7b88bcb43a",
  measurementId: "G-ENH4WNHVE4"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export işlemleri
export { db, ref, get, set };
