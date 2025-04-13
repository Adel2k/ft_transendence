import { createNavbar } from '../../components/navbars.js';
import { createLoginUI } from './loginUI.js';
import { setupLoginForm } from './loginForm.js';

export async function render(root: HTMLElement) {
  root.innerHTML = '';

  const loginUI = createLoginUI();
  root.appendChild(loginUI);

  setupLoginForm(loginUI);
}