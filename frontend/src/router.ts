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

  if (path === '/') {
    import('./views/login/index').then((m) => m.render(app!));
  } else if (path === '/register') {
    import('./views/register/index').then((m) => m.render(app!));
  } else if (path === '/home') {
    import('./views/home/index').then((m) => m.render(app!));
  } else if (path === '/profile') {
    import('./views/profile/index').then((m) => m.render(app!));
  } else if (path === '/settings') {
    import('./views/settings/index').then((m) => m.render(app!));
  } else if (path === '/404') {
    import('./views/error/404').then((m) => m.render(app!));
  } else if (path === '/tournament/create') {
    import('./views/tournament/createTournament').then(async (m) => {
      const root = document.getElementById('app')!;
      root.innerHTML = '';
      root.appendChild(await m.createTournamentUI());
    });
  } else if (path.startsWith('/tournament/') && !path.includes('/game')) {
    const tournamentId = path.split('/')[2];
    const maxPlayers = Number(path.split('/')[3]);
    import('./views/tournament/viewTournament').then((module) => {
      const root = document.getElementById('app');
      if (root) {
        module.renderTournamentPage(root, tournamentId, maxPlayers);
      }
    });
  } else if (path.startsWith('/tournament/game/')) {
    const tournamentId = path.split('/')[3];
    import('./views/tournament/tournamentGame').then((module) => {
      const root = document.getElementById('app');
      if (root) {
        module.renderTournamentGamePage(root, tournamentId);
      }
    });
  } else {
    history.pushState(null, '', '/404');
    import('./views/error/404').then((m) => m.render(app!));
  }
}
