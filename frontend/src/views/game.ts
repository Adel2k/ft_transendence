import { createNavbar } from '../components/navbars.js';

export async function render(root: HTMLElement) {
  root.innerHTML = '';

  const navbar = await createNavbar();
  if (navbar) {
    root.appendChild(navbar);
  }

  const container = document.createElement('div');
  container.className = 'min-h-screen flex items-center justify-center bg-black';

  const canvas = document.createElement('canvas');
  canvas.id = 'pong';
  canvas.className = 'border border-white';
  canvas.width = 800;
  canvas.height = 600;
  container.appendChild(canvas);
  root.appendChild(container);

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(390, 290, 20, 20); // Простейший мячик
  }
}
