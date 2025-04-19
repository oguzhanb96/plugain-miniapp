// Firebase SDK'yı import et
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyBwwATHKjJbwUQT7sNEHl-fVJUAN0mNqpk",
  authDomain: "plugain.firebaseapp.com",
  databaseURL: "https://plugain-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plugain",
  storageBucket: "plugain.firebasestorage.app",
  messagingSenderId: "693636169295",
  appId: "1:693636169295:web:fc965cea5bfe7b88bcb43a",
  measurementId: "G-ENH4WNHVE4"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Kullanıcı verisi kaydetme fonksiyonu
export function saveUserData(userId, username, chatId) {
  return set(ref(database, 'users/' + userId), {
    username: username,
    chatId: chatId,
    createdAt: new Date().toISOString()
  });
}





Add firebase.js to initialize Firebase and save user data
