import { isAuthenticated } from './utils/auth.js';

export async function router() {
  const app = document.getElementById('app');
  const path = window.location.pathname;

  const authenticated = await isAuthenticated();
  if (!authenticated && path !== '/' && path !== '/register') {
    history.pushState(null, '', '/');
    import('./views/login/index.js').then((m) => m.render(app!));
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
      import('./views/home.js').then((m) => m.render(app!));
      break;
    case '/game':
      import('./views/game.js').then((m) => m.render(app!));
      break;
    default:
      app!.innerHTML = '<h1>404 Not Found</h1>';
  }
}
