import { createNavbar } from '../../components/navbars.js';
import { createBackground } from './background.js';
import { createPaddle } from './paddle.js';
import { createContent } from './content.js';
import { getCookie } from '../../utils/cookies.js';

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

    const response = await fetch('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    const { user } = await response.json();

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