<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Mini App</title>
    <script type="module">
        // Firebase SDK importları
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
        import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

        // Firebase yapılandırma
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
        const database = getDatabase(app);

        // Telegram WebApp verisi
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        const userId = user?.id;  // Kullanıcı ID'si
        const username = user?.username || "Anonim";  // Eğer kullanıcı adı yoksa "Anonim"
        const chatId = tg.initDataUnsafe?.chat_instance;

        // Firebase'e kullanıcı verisini kaydetme
        function saveUserData(userId, username, chatId) {
          return set(ref(database, 'users/' + userId), {
            username: username,
            chatId: chatId,
            createdAt: new Date().toISOString(),
            token: 0  // Başlangıçta token 0
          });
        }

        // Kullanıcıyı Firebase'e kaydedelim
        if (userId) {
          saveUserData(userId, username, chatId)
            .then(() => {
              console.log("Kullanıcı Firebase'e kaydedildi!");
            })
            .catch((error) => {
              console.error("Firebase'e kayıt hatası:", error);
            });
        }

        // Token artırma fonksiyonu
        async function incrementUserToken(userId) {
          const userRef = ref(database, 'users/' + userId);
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const currentToken = userData?.token || 0;

          // Token'ı 1 artırıyoruz
          return set(userRef, {
            ...userData,
            token: currentToken + 1
          });
        }

        // Butona tıklama olayı
        document.addEventListener("DOMContentLoaded", function() {
          const collectBtn = document.getElementById("collectBtn");
          const statusText = document.getElementById("status");

          collectBtn.addEventListener("click", () => {
            if (!userId) {
              alert("Kullanıcı bilgisi alınamadı");
              return;
            }

            incrementUserToken(userId)
              .then(() => {
                statusText.innerText = "🎉 Token kazanıldı!";
              })
              .catch((error) => {
                console.error("Token artırma hatası:", error);
                statusText.innerText = "❌ Token artırılamadı.";
              });
          });
        });
    </script>
</head>
<body>
    <h1>Telegram Mini App</h1>
    <button id="collectBtn">Token Topla</button>
    <p id="status">Durum: Bekliyor...</p>
</body>
</html>
