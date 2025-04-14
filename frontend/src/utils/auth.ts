import { getCookie, setCookie, deleteCookie } from './cookies.js';

export async function isAuthenticated(): Promise<boolean> {
  const token = getCookie('token');
  return !!token;
}

export function logout() {
  deleteCookie('token');
  history.pushState(null, '', '/');
  window.location.reload();
}