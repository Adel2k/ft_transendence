import { setCookie } from '../../utils/cookies.js';

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const { tempToken, message } = JSON.parse(await response.text());
  setCookie('token', tempToken);
  setCookie('2fa', message === '2FA required.' ? 'true' : 'false');
  return tempToken;
}