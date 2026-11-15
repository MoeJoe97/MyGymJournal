import test from 'node:test';
import assert from 'node:assert/strict';
import '../public/sw-cache-policy.js';

const { isCacheableResponse } = globalThis.MyGymJournalCachePolicy;
const origin = 'https://gym.example';
const request = (url, method = 'GET') => ({ url, method });
const response = (overrides = {}) => ({ ok: true, redirected: false, type: 'basic', ...overrides });

test('allows successful same-origin GET responses', () => {
  assert.equal(isCacheableResponse(request(`${origin}/assets/app.js`), response(), origin), true);
});

test('rejects non-GET, cross-origin, and failed responses', () => {
  assert.equal(isCacheableResponse(request(`${origin}/assets/app.js`, 'POST'), response(), origin), false);
  assert.equal(isCacheableResponse(request('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'), response(), origin), false);
  assert.equal(isCacheableResponse(request('https://cdn.example/app.js'), response(), origin), false);
  assert.equal(isCacheableResponse(request(`${origin}/assets/missing.js`), response({ ok: false }), origin), false);
});

test('rejects redirected SSO, API, Firebase, and credential-bearing responses', () => {
  assert.equal(isCacheableResponse(request(`${origin}/manifest.webmanifest`), response({ redirected: true }), origin), false);
  assert.equal(isCacheableResponse(request(`${origin}/api/profile`), response(), origin), false);
  assert.equal(isCacheableResponse(request(`${origin}/__/firebase/init.json`), response(), origin), false);
  assert.equal(isCacheableResponse(request(`${origin}/__/auth/handler`), response(), origin), false);
  assert.equal(isCacheableResponse(request(`${origin}/file?token=secret`), response(), origin), false);
});
