import { getCookie } from './utils/cookies';
import { connectToWebSocket, getWebSocket } from './utils/socket';

export function checkTwoFA(token: string | null): boolean {
  if (getCookie('2fa') === 'true' && getCookie('2faCode') === 'false') {
    return !token;
  } else {
    return !!token;
  }
}

export async function router() {
  const app = document.getElementById('app');
  const path = window.location.pathname;

  const token = getCookie('token');
  let authenticated: boolean;

  authenticated = checkTwoFA(token);
  if (authenticated && !getWebSocket() && token) {
    connectToWebSocket(token);
  }

  if (authenticated && (path === '/' || path === '/register')) {
    history.pushState(null, '', '/home');
    import('./views/home/index').then((m) => m.render(app!));
    return;
  }

  if (!authenticated && path !== '/' && path !== '/register') {
    history.pushState(null, '', '/');
    import('./views/login/index').then((m) => m.render(app!));
    return;
  }

  switch (path) {
    case '/':
      import('./views/login/index').then((m) => m.render(app!));
      break;
    case '/register':
      import('./views/register/index').then((m) => m.render(app!));
      break;
    case '/home':
      import('./views/home/index').then((m) => m.render(app!));
      break;
    case '/profile':
      import('./views/profile/index').then((m) => m.render(app!));
      break;
    case '/game':
      import('./views/game/index').then((m) => m.render(app!));
      break;
    case '/settings':
      import('./views/settings/index').then((m) => m.render(app!));
      break;
    case '/404':
      import('./views/error/404').then((m) => m.render(app!));
      break;
    default:
      history.pushState(null, '', '/404');
      import('./views/error/404').then((m) => m.render(app!));
  }
}
