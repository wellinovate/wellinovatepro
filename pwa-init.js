// Wellinovate PWA Registration & Offline Continuity Monitor
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        // Service worker registered successfully
      })
      .catch((err) => {
        console.warn('[Wellinovate PWA] Service worker registration failed:', err);
      });
  });
}

// Offline Continuity Status Handler
function updateOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;

  if (!navigator.onLine) {
    banner.classList.add('active');
  } else {
    banner.classList.remove('active');
  }
}

window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('online', updateOnlineStatus);
document.addEventListener('DOMContentLoaded', updateOnlineStatus);
