const MIN_NICKNAME_LENGTH = 2;
const MAX_NICKNAME_LENGTH = 80;

function normalizeNickname(value) {
  if (typeof value !== 'string') return '';
  const nickname = value.trim();
  return nickname.length >= MIN_NICKNAME_LENGTH && nickname.length <= MAX_NICKNAME_LENGTH ? nickname : '';
}

export function buildMissingProfile(existingProfile, user) {
  if (existingProfile) return null;

  const displayName = normalizeNickname(user.displayName);
  const emailLocalPart = typeof user.email === 'string' ? user.email.split('@')[0] : '';
  const nickname = displayName || normalizeNickname(emailLocalPart) || 'User';

  return {
    admin: false,
    nickname,
    email: user.email || '',
  };
}
