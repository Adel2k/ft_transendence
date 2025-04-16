import { createFloatingShape } from '../shape/error';

export function render(root: HTMLElement) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className =
    'relative flex items-center justify-center min-h-screen bg-gradient-404 overflow-hidden';

  const shapesContainer = document.createElement('div');
  shapesContainer.className = 'absolute inset-0 overflow-hidden z-0';
  container.appendChild(shapesContainer);

  const text = document.createElement('h1');
  text.textContent = '404 Not Found';
  text.style.userSelect = 'none';
  text.className =
    'text-8xl font-bold text-gray-300 animate-float-up-down bg-clip-text bg-gradient-to-r text-shadow-behind';
  container.appendChild(text);

  root.appendChild(container);

  setInterval(() => createFloatingShape(shapesContainer), 10);
}