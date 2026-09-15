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

// ==============================================================================
// Content Protection & Anti-Copy System
// ==============================================================================
(function initContentProtection() {
  let toastTimeout = null;

  function showProtectionToast(message) {
    let toast = document.getElementById('content-protect-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'content-protect-toast';
      toast.className = 'content-protect-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span id="content-protect-msg"></span>
      `;
      document.body.appendChild(toast);
    }

    const msgEl = document.getElementById('content-protect-msg');
    if (msgEl) {
      msgEl.textContent = message || 'Protected Material — Word copying is restricted on this platform.';
    }

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function isFormInput(el) {
    if (!el) return false;
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    return (
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      el.isContentEditable ||
      (el.closest && el.closest('.allow-select, .sim-console'))
    );
  }

  // 1. Intercept Copy
  document.addEventListener('copy', (e) => {
    if (isFormInput(e.target) || isFormInput(document.activeElement)) {
      return; // Allow copying/pasting within legitimate form inputs
    }
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.clearData();
    }
    showProtectionToast('Protected Content — Text copying is disabled to protect Wellinovate proprietary clinical material.');
  });

  // 2. Intercept Cut
  document.addEventListener('cut', (e) => {
    if (isFormInput(e.target) || isFormInput(document.activeElement)) {
      return;
    }
    e.preventDefault();
    showProtectionToast('Protected Content — Word copying is restricted.');
  });

  // 3. Prevent Dragging Text & Images
  document.addEventListener('dragstart', (e) => {
    if (isFormInput(e.target)) return;
    e.preventDefault();
  });

  // 4. Intercept Selectstart on protected content
  document.addEventListener('selectstart', (e) => {
    if (isFormInput(e.target)) return;
    e.preventDefault();
  });

  // 5. Intercept Right-Click Context Menu on protected content
  document.addEventListener('contextmenu', (e) => {
    if (isFormInput(e.target)) return;
    e.preventDefault();
    showProtectionToast('Protected Material — Right-click & word copying are restricted.');
  });

  // 6. Keyboard Shortcut Interception (Ctrl/Cmd + C, U, S)
  document.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    if (!isCmdOrCtrl) return;

    if (isFormInput(e.target) || isFormInput(document.activeElement)) {
      return;
    }

    const key = e.key ? e.key.toLowerCase() : '';
    if (key === 'c') {
      e.preventDefault();
      showProtectionToast('Protected Content — Word copying is restricted.');
    } else if (key === 'u' || key === 's') {
      e.preventDefault();
      showProtectionToast('Protected Material — Source export is restricted.');
    }
  });
})();
