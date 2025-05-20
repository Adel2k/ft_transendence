import { createLoginUI } from './loginUI';
import { setupLoginForm } from './loginForm';
import { createTwoFAModal } from './loginModal';

export async function render(root: HTMLElement) {
  if (!root) {
    return;
  }

  root.innerHTML = '';

  const loginUI = createLoginUI();
  root.appendChild(loginUI);

  setupLoginForm(loginUI);

  createTwoFAModal(root, () => {
    history.pushState(null, '', '/home');
    import('../home/index').then((m) => m.render(root));
  });
}