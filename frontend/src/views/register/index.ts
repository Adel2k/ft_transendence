import { createNavbar } from '../../components/navbars.js';
import { createRegisterUI } from './registerUI.js';
import { setupRegisterForm } from './registerForm.js';

export async function render(root: HTMLElement) {
  root.innerHTML = '';

  const registerUI = createRegisterUI();
  root.appendChild(registerUI);

  setupRegisterForm(registerUI);
}