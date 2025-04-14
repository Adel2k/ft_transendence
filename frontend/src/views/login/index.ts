import { getCookie } from '../../utils/cookies.js';
import { createLoginUI } from './loginUI.js';
import { setupLoginForm } from './loginForm.js';

export async function render(root: HTMLElement) {
  if (!root) {
    console.error('Root element not found');
    return;
  }

  root.innerHTML = '';

  const token = getCookie('token');
  if (token) {
    console.log('User is already authenticated, redirecting to /home...');
    history.pushState(null, '', '/home');
    const app = document.getElementById('app');
    import('../home/index.js').then((m) => m.render(app!));
    return;
  }

  const loginUI = createLoginUI();
  root.appendChild(loginUI);

  setupLoginForm(loginUI);
}