import { createNavbar } from '../../components/navbars';
import { createBackground } from './background';
import { createPaddle } from './paddle';
import { createContent } from './content';
import { getCookie } from '../../utils/cookies';

export async function render(root: HTMLElement) {
  if (!root) {
    console.error('Root element not found');
    return;
  }

  root.innerHTML = '';
  try {
    const token = getCookie('token');
    if (!token) {
      throw new Error('No token found');
    }

    const background = createBackground();
    background.appendChild(createPaddle());
    background.appendChild(createContent());
    const navbar = await createNavbar();

    root.appendChild(background);
    if (navbar) {
      root.appendChild(navbar);
    }
  } catch (error) {
    console.error('Error rendering profile page:', error);
    root.innerHTML =
      '<p class="text-red-500">Failed to load profile page. Please try again later.</p>';
    sessionStorage.clear();
  }
}