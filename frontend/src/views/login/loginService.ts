import { setCookie } from '../../utils/cookies.js';

export async function login(email: string, password: string): Promise<boolean> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const responseText = await response.text();

  if (responseText.includes('token')) {
    const { token } = JSON.parse(responseText);
    setCookie('token', token);
    setCookie('2fa', 'false');
    setCookie('2faCode', 'true');
    console.log('Login successful, token:', token);
    return false;
  } else if (responseText.includes('tempToken')) {
    const { tempToken } = JSON.parse(responseText);
    setCookie('token', tempToken);
    setCookie('2fa', 'true');
    setCookie('2faCode', 'false');
    console.log('Login successful, token:', tempToken);
    return true;
  }

  throw new Error('Unexpected response from server');
}