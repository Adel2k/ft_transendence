import './styles/input.css';
import { router } from './router';
import { getCookie } from './utils/cookies';
import { connectToWebSocket, disconnectWebSocket } from './utils/socket';

window.addEventListener('DOMContentLoaded', () => {
  if (!sessionStorage.getItem('initialized')) {
    sessionStorage.clear();
    sessionStorage.setItem('initialized', 'true');
  }

  const token = getCookie('token');
  if (token) {
    connectToWebSocket(token);
  }

  router();
  window.addEventListener('popstate', router);
});

window.addEventListener('beforeunload', () => {
  disconnectWebSocket();
});
