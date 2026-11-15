(function attachCachePolicy(scope) {
  const excludedHosts = [
    'googleapis.com',
    'firebaseio.com',
    'firebasestorage.app',
    'firebasestorage.googleapis.com',
  ];

  function isCacheableResponse(request, response, origin) {
    if (!request || request.method !== 'GET' || !response || !response.ok || response.redirected) return false;

    let url;
    try {
      url = new URL(request.url);
    } catch {
      return false;
    }

    if (url.origin !== origin) return false;
    if (excludedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return false;
    if (/^\/api(?:\/|$)/i.test(url.pathname) || url.pathname.startsWith('/__/')) return false;
    if (['token', 'key', 'auth', 'code'].some((key) => url.searchParams.has(key))) return false;
    if (response.type && response.type !== 'basic' && response.type !== 'default') return false;

    return true;
  }

  scope.MyGymJournalCachePolicy = Object.freeze({ isCacheableResponse });
})(globalThis);
