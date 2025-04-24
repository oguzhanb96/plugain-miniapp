// Ortak fonksiyonlar ve ayarlar
// Firebase ayarları
const FIREBASE_URL = "https://plugain-1f481-default-rtdb.europe-west1.firebasedatabase.app";

function getTelegramUser() {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
}

function getUserId() {
  const tgUser = getTelegramUser();
  if (tgUser && tgUser.id) {
    localStorage.setItem('plugainUserId', tgUser.id);
    if (tgUser.first_name) localStorage.setItem('plugainUserName', tgUser.first_name);
    return tgUser.id;
  }
  let userId = localStorage.getItem('plugainUserId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('plugainUserId', userId);
  }
  return userId;
}

function getUserName() {
  const tgUser = getTelegramUser();
  if (tgUser && tgUser.first_name) {
    localStorage.setItem('plugainUserName', tgUser.first_name);
    return tgUser.first_name;
  }
  return localStorage.getItem('plugainUserName') || 'Kullanıcı';
}

function fetchUserData(callback) {
  const userId = getUserId();
  fetch(`${FIREBASE_URL}/users/${userId}.json`)
    .then(r => r.json())
    .then(userData => {
      callback(userData || {});
    });
}

function fetchPlugainCoin(callback) {
  fetchUserData(function(userData) {
    callback(userData && typeof userData.plugainCoin !== 'undefined' ? userData.plugainCoin : 0);
  });
}

function setWelcomeGiftIfNeeded() {
  const userId = getUserId();
  const name = getUserName();
  fetch(`${FIREBASE_URL}/users/${userId}.json`)
    .then(r => r.json())
    .then(userData => {
      if (!userData || !userData.welcomeGift) {
        const newUser = Object.assign({ points: 50, plugainCoin: 0, clickCount: 0, welcomeGift: true, giftName: 'Welcome Plugain Family', name: name }, userData || {});
        fetch(`${FIREBASE_URL}/users/${userId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        showToast('Tebrikler! Welcome Plugain Family hediyesi olarak 50 puan kazandınız.');
      }
    });
}

function showToast(msg) {
  let toast = document.getElementById('plugain-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'plugain-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '32px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '18px 32px';
    toast.style.borderRadius = '16px';
    toast.style.fontSize = '1.1rem';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0.96';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3500);
}

function setDarkModeFromStorage() {
  if (localStorage.getItem('plugainDarkMode') === 'true') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function setupDarkModeToggle() {
  const darkToggle = document.getElementById('dark-toggle');
  if (!darkToggle) return;
  function updateDarkIcon() {
    darkToggle.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌙';
  }
  darkToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('plugainDarkMode', document.body.classList.contains('dark-mode'));
    updateDarkIcon();
  });
  setDarkModeFromStorage();
  updateDarkIcon();
}

function renderLeaderboard(containerId) {
  fetch(`${FIREBASE_URL}/users.json`)
    .then(r => r.json())
    .then(users => {
      if (!users) return;
      let arr = Object.entries(users).map(([id, data]) => ({ name: data.name || id, coin: data.plugainCoin || 0 }));
      arr = arr.sort((a, b) => b.coin - a.coin).slice(0, 10);
      let html = '<h3 style="color:var(--accent-color);margin-bottom:14px;">Liderlik Tablosu</h3>';
      html += '<table style="width:100%;border-collapse:collapse;"><tr style="background:#eee;color:#222;"><th>#</th><th>Kullanıcı</th><th>PlugainCoin</th></tr>';
      arr.forEach((user, idx) => {
        html += `<tr style="background:${idx%2?'#fafafa':'#fff'};"><td>${idx+1}</td><td>${user.name}</td><td>${user.coin}</td></tr>`;
      });
      html += '</table>';
      document.getElementById(containerId).innerHTML = html;
    });
}
