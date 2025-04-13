import { createNavbar } from '../../components/navbars.js';
import { createBackground } from './background.js';
import { createPaddle } from './paddle.js';
import { createContent } from './content.js';

export async function render(root: HTMLElement) {
  root.innerHTML = '';

  const background = createBackground();
  background.appendChild(createPaddle());
  background.appendChild(createContent());
  const navbar = await createNavbar();

  root.appendChild(background);
  if (navbar) {
    root.appendChild(navbar);
  }
}