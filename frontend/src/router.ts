import { getCookie } from './utils/cookies.js';

export async function router() {
  const app = document.getElementById('app');
  const path = window.location.pathname;

  const token = getCookie('token');
  let authenticated: boolean;
  if (getCookie('2fa') === 'true' && getCookie('2faCode') === 'true') {
    authenticated = !!token;
  } else if (getCookie('2fa') === 'true' && getCookie('2faCode') === 'false') {
    authenticated = !token;
  } else {
    authenticated = !!token;
  }

  if (authenticated && (path === '/' || path === '/register')) {
    history.pushState(null, '', '/home');
    import('./views/home/index.js').then((m) => m.render(app!));
    return;
  }

  if (!authenticated && path !== '/' && path !== '/register') {
    history.pushState(null, '', '/404');
    import('./views/error/404.js').then((m) => m.render(app!));
    return;
  }

  switch (path) {
    case '/':
      import('./views/login/index.js').then((m) => m.render(app!));
      break;
    case '/register':
      import('./views/register/index.js').then((m) => m.render(app!));
      break;
    case '/home':
      import('./views/home/index.js').then((m) => m.render(app!));
      break;
    case '/profile':
      import('./views/profile/index.js').then((m) => m.render(app!));
      break;
    case '/game':
      import('./views/game.js').then((m) => m.render(app!));
      break;
    case '/404':
      import('./views/error/404.js').then((m) => m.render(app!));
      break;
    default:
      history.pushState(null, '', '/404');
      import('./views/error/404.js').then((m) => m.render(app!));
  }
}
