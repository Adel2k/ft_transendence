import { createRegisterUI } from './registerUI';
import { setupRegisterForm } from './registerForm';

export async function render(root: HTMLElement) {
  root.innerHTML = '';

  const registerUI = createRegisterUI();
  root.appendChild(registerUI);

  setupRegisterForm(registerUI);
}