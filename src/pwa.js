export function setupPwa({ onUpdate } = {}) {
  let deferredInstallPrompt = null;
  const updateBanner = document.createElement('div');
  updateBanner.className = 'pwa-update-banner';
  updateBanner.innerHTML = '<span>A new version is available</span><button type="button">Update</button>';
  updateBanner.querySelector('button').addEventListener('click', () => window.location.reload());
  document.body.appendChild(updateBanner);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              updateBanner.classList.add('open');
              onUpdate?.();
            }
          });
        });
      } catch (error) { console.warn('[pwa] Service worker unavailable:', error); }
    });
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    window.dispatchEvent(new CustomEvent('gymjournal:install-available'));
  });
  window.installGymJournal = async () => {
    if (!deferredInstallPrompt) return false;
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return result.outcome === 'accepted';
  };
  window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; window.dispatchEvent(new CustomEvent('gymjournal:installed')); });
}
