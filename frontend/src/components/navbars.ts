import { isAuthenticated, logout } from '../utils/auth';
import { getIcon } from '../icons/getIcon';

export async function createNavbar(): Promise<HTMLElement | null> {
  const authenticated = await isAuthenticated();
  if (!authenticated) return null;

  const nav = document.createElement('nav');
  nav.className = 'fixed top-0 left-0 h-full w-16 sm:w-20 md:w-24 bg-gray-800 flex flex-col items-center py-6 gap-12 transition-all';

  const links = [
    { href: '/home', label: 'Home', icon: 'home' },
    { href: '/game', label: 'Matchmaking', icon: 'game' },
    { href: '/profile', label: 'Profile', icon: 'profile' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
  ];

  links.forEach(({ href, label, icon }) => {
    const link = document.createElement('a');
    link.href = href;
    link.title = label;
    link.className = 'flex justify-center items-center w-full text-white hover:text-blue-400 cursor-pointer text-lg sm:text-xl md:text-2xl';
    link.innerHTML = getIcon(icon);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', href);
      import('../router').then((m) => m.router());
    });
    nav.appendChild(link);
  });

  const logoutButton = document.createElement('button');
  logoutButton.title = 'Logout';
  logoutButton.className = 'mt-auto flex justify-center items-center w-full text-white hover:text-red-400 cursor-pointer text-lg sm:text-xl md:text-2xl';
  logoutButton.innerHTML = getIcon('logout');
  logoutButton.addEventListener('click', logout);
  nav.appendChild(logoutButton);

  return nav;
}
