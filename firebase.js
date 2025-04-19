// Token toplama fonksiyonu
document.getElementById("collect").addEventListener("click", () => {
  const userId = tg.initDataUnsafe.id; // Kullanıcı ID'sini al

  if (userId) {
    const userRef = ref(db, 'kullanicilar/' + userId); // 'users' yerine 'kullanicilar' kullanıyoruz

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
