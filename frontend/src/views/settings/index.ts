import { createNavbar } from '../../components/navbars';

export async function render(root: HTMLElement) {
  root.innerHTML = '';

  const container = document.createElement('div');
  container.className =
    'relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white via-gray-500 to-black overflow-hidden';

  const shapesContainer = document.createElement('div');
  shapesContainer.className = 'absolute inset-0 overflow-hidden z-0';
  container.appendChild(shapesContainer);

  const text = document.createElement('h1');
  text.textContent = 'Comming Soon...';
  text.style.userSelect = 'none';
  text.className =
    'font-bold text-gray-300 animate-float-up-down bg-clip-text bg-gradient-to-r text-shadow-behind sm:text-xl md:text-3xl lg:text-8xl mt-16 ml-8';
  container.appendChild(text);

  root.appendChild(container);

  const navbar = await createNavbar();
  if (navbar) {
    root.appendChild(navbar);
  }
}