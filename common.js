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
  return localStorage.getItem('plugainUserName') || 'User';
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
        showWelcomeGiftToast();
      }
    });
}

function showWelcomeGiftToast() {
  let toast = document.getElementById('plugain-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'plugain-toast';
    toast.style.position = 'fixed';
    toast.style.top = '50%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '28px 42px';
    toast.style.borderRadius = '22px';
    toast.style.fontSize = '1.25rem';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0.98';
    toast.style.textAlign = 'center';
    toast.style.boxShadow = '0 8px 40px rgba(0,0,0,0.18)';
    document.body.appendChild(toast);
  }
  toast.textContent = '🎉 Welcome to Plugain Family! You have received 50 points.';
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3800);
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

function showConfetti() {
  const confetti = document.createElement('canvas');
  confetti.id = 'confetti-canvas';
  confetti.style.position = 'fixed';
  confetti.style.left = '0';
  confetti.style.top = '0';
  confetti.style.width = '100vw';
  confetti.style.height = '100vh';
  confetti.style.pointerEvents = 'none';
  confetti.style.zIndex = '99999';
  document.body.appendChild(confetti);
  // Simple confetti burst
  const ctx = confetti.getContext('2d');
  const w = window.innerWidth;
  const h = window.innerHeight;
  confetti.width = w;
  confetti.height = h;
  let pieces = Array.from({length: 32}, () => ({
    x: Math.random() * w,
    y: h/2 + (Math.random()-0.5)*80,
    r: 8 + Math.random()*8,
    d: 2 + Math.random()*4,
    color: `hsl(${Math.random()*360},100%,60%)`,
    angle: Math.random()*2*Math.PI
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,w,h);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0,0,p.r,0,2*Math.PI);
      ctx.fill();
      ctx.restore();
      p.y += p.d;
      p.angle += 0.05;
    });
    frame++;
    if(frame < 45) requestAnimationFrame(draw);
    else confetti.remove();
  }
  draw();
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
    darkToggle.textContent = '🌙';
    darkToggle.style.fontSize = '1.7em';
    darkToggle.style.lineHeight = '1';
    darkToggle.style.width = '38px';
    darkToggle.style.height = '38px';
    darkToggle.style.display = 'flex';
    darkToggle.style.justifyContent = 'center';
    darkToggle.style.alignItems = 'center';
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
      let medals = [
        '<span style="color:#FFD700;font-size:1.1em;">🥇</span>', // Gold
        '<span style="color:#C0C0C0;font-size:1.1em;">🥈</span>', // Silver
        '<span style="color:#CD7F32;font-size:1.1em;">🥉</span>'  // Bronze
      ];
      let html = '<div style="background:var(--card-bg);margin:32px auto;padding:28px 18px 18px 18px;border-radius:18px;max-width:440px;box-shadow:0 6px 24px rgba(0,0,0,0.10);">';
      html += '<h3 style="color:var(--accent-color);margin-bottom:18px;font-size:1.4em;letter-spacing:1px;">Leaderboard</h3>';
      html += '<table style="width:100%;border-collapse:collapse;font-size:1.08em;">';
      html += '<tr style="background:#f8f8f8;color:#222;font-weight:600;"><th style="padding:8px 0;width:40px;">#</th><th style="text-align:left;padding:8px 0;">User</th><th style="padding:8px 0;">PlugainCoin</th></tr>';
      arr.forEach((user, idx) => {
        let style = idx === 0 ? 'background:rgba(255,215,0,0.08);font-weight:bold;' : idx === 1 ? 'background:rgba(192,192,192,0.08);' : idx === 2 ? 'background:rgba(205,127,50,0.08);' : 'background:#fff;';
        let medal = idx < 3 ? medals[idx] : '';
        html += `<tr style="${style}"><td style="text-align:center;">${idx+1} ${medal}</td><td style="text-align:left;">${user.name}</td><td style="text-align:center;">${user.coin}</td></tr>`;
      });
      html += '</table></div>';
      document.getElementById(containerId).innerHTML = html;
    });
}

function showAdRewardToast() {
  let adToast = document.getElementById('plugain-ad-toast');
  if (!adToast) {
    adToast = document.createElement('div');
    adToast.id = 'plugain-ad-toast';
    adToast.style.position = 'fixed';
    adToast.style.top = '50%';
    adToast.style.left = '50%';
    adToast.style.transform = 'translate(-50%, -50%)';
    adToast.style.background = 'linear-gradient(100deg,#fffbe6 0%, #e0ffd6 100%)';
    adToast.style.color = '#2d995b';
    adToast.style.padding = '30px 44px';
    adToast.style.borderRadius = '25px';
    adToast.style.fontSize = '1.23rem';
    adToast.style.fontWeight = 'bold';
    adToast.style.zIndex = '99999';
    adToast.style.opacity = '0.98';
    adToast.style.textAlign = 'center';
    adToast.style.boxShadow = '0 12px 48px rgba(80,180,70,0.14)';
    adToast.style.border = '2.5px solid #a0e7b6';
    adToast.innerHTML = '<span style="font-size:1.8em;">🎁</span><br>+10 Points Earned!';
    document.body.appendChild(adToast);
  }
  adToast.style.display = 'block';
  setTimeout(() => { adToast.style.display = 'none'; }, 1000);
}
