import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMissingProfile } from '../src/domain/profile-fallback.js';

test('uses the email local part when display name is missing', () => {
  assert.deepEqual(buildMissingProfile(null, { displayName: null, email: 'alex@example.test' }), {
    admin: false,
    nickname: 'alex',
    email: 'alex@example.test',
  });
});

test('uses the email local part when the display name is too short', () => {
  assert.equal(buildMissingProfile(null, { displayName: 'X', email: 'alex@example.test' }).nickname, 'alex');
});

test('preserves a valid display name', () => {
  assert.equal(buildMissingProfile(null, { displayName: 'Alex Morgan', email: 'alex@example.test' }).nickname, 'Alex Morgan');
});

test('does not create or overwrite an existing profile', () => {
  assert.equal(buildMissingProfile({ nickname: 'Existing' }, { displayName: 'Changed', email: 'alex@example.test' }), null);
});

test('uses a neutral valid name when no appropriate fallback exists', () => {
  assert.equal(buildMissingProfile(null, { displayName: 'X', email: 'x@example.test' }).nickname, 'User');
});
