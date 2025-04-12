import { isAuthenticated, logout } from '../utils/auth.js';

export async function createNavbar(): Promise<HTMLElement | null> {
  const authenticated = await isAuthenticated();
  if (!authenticated) return null;

  const nav = document.createElement('nav');
  nav.className = 'p-4 bg-gray-800 flex gap-4';

  const links = [
    { href: '/home', label: 'Home' },
    { href: '/game', label: 'Game' },
  ];

  links.forEach(({ href, label }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.className = 'text-white hover:underline cursor-pointer';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', href);
      import('../router.js').then((m) => m.router());
    });
    nav.appendChild(a);
  });

  const logoutButton = document.createElement('button');
  logoutButton.textContent = 'Logout';
  logoutButton.className = 'text-white hover:underline cursor-pointer';
  logoutButton.addEventListener('click', logout);
  nav.appendChild(logoutButton);

  return nav;
}
