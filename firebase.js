// Telegram Web App'ten gelen veriyi almak için
tg.initDataUnsafe = JSON.parse(tg.initData);  // Telegram'dan gelen veriyi JSON olarak alıyoruz

// Kullanıcı verisini log ile kontrol et
const user = tg.initDataUnsafe;
console.log("Kullanıcı Verisi:", user);  // Konsola yazdırıyoruz

// Eğer kullanıcı verisi doğru geldiyse, kullanıcı adı ve ID'sini sayfada gösterelim
if (user) {
  const username = user.username || "Bilinmeyen Kullanıcı"; // Kullanıcı adı varsa, yoksa "Bilinmeyen Kullanıcı" olarak al
  console.log("Kullanıcı Adı:", username);

  // Kullanıcı adını sayfada görüntüle
  document.getElementById("username").textContent = username;

  // Firebase Realtime Database'den kullanıcı verisini alıyoruz
  const userId = user.id; // Telegram kullanıcı ID'si
  const userRef = ref(db, 'kullanicilar/' + username);  // 'users' yerine 'kullanicilar' kullanıyoruz, kullanıcı adına göre veriyi alıyoruz

  // Kullanıcı verilerini al
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const currentTokens = userData.puan || 0;  // "puan" verisini al, yoksa 0 kabul et
      console.log("Mevcut Token Sayısı:", currentTokens);

      // Token sayısını sayfada göster
      document.getElementById("token").textContent = currentTokens;
    } else {
      console.log("Kullanıcı verisi Firebase'ten alınamadı.");
    }
  }).catch((error) => {
    console.error("Veri alınırken hata oluştu:", error);
  });
} else {
  console.log("Kullanıcı verisi alınamadı.");
}

// Token toplama işlemi
document.getElementById("collect").addEventListener("click", () => {
  const userId = tg.initDataUnsafe.id; // Kullanıcı ID'sini al
  const username = tg.initDataUnsafe.username || "Bilinmeyen Kullanıcı"; // Kullanıcı adını al

  if (username) {
    const userRef = ref(db, 'kullanicilar/' + username);  // Kullanıcı adına göre veriyi güncelliyoruz

    // Kullanıcı verilerini al
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        let userData = snapshot.val();
        let currentTokens = userData.puan || 0;  // Mevcut token sayısını al, yoksa 0
        let newTokenCount = currentTokens + 1;  // Yeni token sayısını artır

        // Yeni token sayısını Firebase'e kaydet
        set(userRef, {
          puan: newTokenCount
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
