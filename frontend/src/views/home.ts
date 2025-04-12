import { createNavbar } from '../components/navbars.js';

export function render(root: HTMLElement) {
  root.innerHTML = '';
  root.appendChild(createNavbar());

  const div = document.createElement('div');
  div.className = 'p-4';
  div.innerHTML = `<h1 class="text-3xl font-bold">Welcome to Pong</h1>`;
  root.appendChild(div);
}
