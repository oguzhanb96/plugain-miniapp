import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase Konfigürasyonu (Dışarıdan alınabilir)
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

// Firebase Başlatma
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("Firebase başlatıldı.");
} catch (error) {
    console.error("Firebase başlatma hatası:", error);
    // Burada kullanıcıya bir hata mesajı göstermek isteyebilirsiniz.
}

// Fonksiyon: Kullanıcı verilerini getir ve arayüzü güncelle
const fetchAndDisplayUserData = async (username) => {
    if (!db) {
        console.warn("Firebase başlatılmamış, veri getirilemiyor.");
        document.getElementById("status").textContent = "Durum: Firebase başlatılamadı!";
        return;
    }

    const userRef = ref(db, 'kullanicilar/' + username);

    try {
        const snapshot = await get(userRef);
        let currentTokens = 0;

        if (snapshot.exists()) {
            const userData = snapshot.val();
            currentTokens = userData.puan || 0;
        }

        document.getElementById("username").textContent = username;
        document.getElementById("token").textContent = currentTokens;
        document.getElementById("status").textContent = "Durum: Veri yüklendi.";

    } catch (error) {
        console.error("Veri getirme hatası:", error);
        document.getElementById("status").textContent = "Durum: Veri alınırken hata oluştu!";
    }
};

// Fonksiyon: Token topla
const collectToken = async (username) => {
    if (!db) {
        console.warn("Firebase başlatılmamış, token toplanamıyor.");
        document.getElementById("status").textContent = "Durum: Firebase başlatılamadı!";
        return;
    }

    const userRef = ref(db, 'kullanicilar/' + username);

    try {
        const snapshot = await get(userRef);
        let currentTokens = 0;

        if (snapshot.exists()) {
            const userData = snapshot.val();
            currentTokens = userData.puan || 0;
        }

        const newTokenCount = currentTokens + 1;
        await set(userRef, { puan: newTokenCount });

        document.getElementById("token").textContent = newTokenCount;
        document.getElementById("status").textContent = "Durum: Token toplandı!";

    } catch (error) {
        console.error("Token toplama hatası:", error);
        document.getElementById("status").textContent = "Durum: Token toplama hatası!";
    }
};

// Fonksiyon: Telegram Web App'den kullanıcı verilerini al
const initializeTelegram = () => {
    try {
        const tg = window.Telegram.WebApp;
        tg.initDataUnsafe = JSON.parse(tg.initData);
        return tg.initDataUnsafe;
    } catch (error) {
        console.error("Telegram başlatma hatası:", error);
        document.getElementById("status").textContent = "Durum: Telegram başlatılamadı!";
        return null;
    }
};

// Sayfa yüklendiğinde yapılacak işlemler
window.onload = () => {
    const user = initializeTelegram();

    if (user && user.username) {
        fetchAndDisplayUserData(user.username);
    } else {
        console.log("Kullanıcı adı alınamadı.");
        document.getElementById("status").textContent = "Durum: Kullanıcı adı alınamadı!";
    }

    document.getElementById("collect").addEventListener("click", () => {
        if (user && user.username) {
            collectToken(user.username);
        } else {
            console.log("Kullanıcı adı alınamadı.");
            document.getElementById("status").textContent = "Durum: Kullanıcı adı alınamadı!";
        }
    });
};
