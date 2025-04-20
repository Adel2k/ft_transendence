import { getCookie, deleteCookie } from './cookies';
import { disconnectWebSocket } from './socket';

export async function isAuthenticated(): Promise<boolean> {
  const token = getCookie('token');
  return !!token;
}

export function logout() {
  disconnectWebSocket();
  deleteCookie('token');
  history.pushState(null, '', '/');
  window.location.reload();
}