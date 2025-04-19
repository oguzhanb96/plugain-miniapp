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
const db = getDatabase(app);

// Token toplama fonksiyonu
document.getElementById("collect").addEventListener("click", () => {
  const userId = tg.initDataUnsafe.id; // Kullanıcı ID'sini al

  if (userId) {
    const userRef = ref(db, 'users/' + userId);

    // Kullanıcı verilerini al
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        let userData = snapshot.val();
        let currentTokens = userData.tokens || 0;  // Mevcut token sayısını al, yoksa 0
        let newTokenCount = currentTokens + 1;  // Yeni token sayısını artır

        // Yeni token sayısını Firebase'e kaydet
        set(userRef, {
          username: userData.username,
          tokens: newTokenCount
        }).then(() => {
          // Token sayısını sayfada güncelle
          document.getElementById("token").textContent = newTokenCount;
          document.getElementById("status").textContent = "Durum: Token toplandı!";
        });
      } else {
        console.log("Kullanıcı verisi bulunamadı.");
      }
    }).catch((error) => {
      console.error("Veri alınırken hata oluştu:", error);
    });
  } else {
    console.log("Kullanıcı ID'si alınamadı.");
  }
});
