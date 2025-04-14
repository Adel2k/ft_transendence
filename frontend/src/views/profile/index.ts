import { createNavbar } from '../../components/navbars.js';
import { createAvatarSection } from './avatar.js';
import { createUsernameSection } from './username.js';
import { createStatsSection } from './stats.js';
import { createTwoFASection } from './twofa.js';
import { createFriendsSection } from './friends.js';
import { createHistorySection } from './history.js';
import { fetchUserData } from './dataFetch.js';
import { getCookie } from '../../utils/cookies.js';

export async function render(root: HTMLElement) {
  if (!root) {
    console.error('Root element not found');
    return;
  }
  
  root.innerHTML = '';
  
  const container = document.createElement('div');
  container.className =
  'min-h-screen flex flex-col md:flex-row gap-8 p-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-gray-800';
  
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const { user, friends, history } = await fetchUserData(token);
    
    const avatarSection = createAvatarSection(user.avatarUrl);
    const usernameSection = createUsernameSection(user.username);
    const statsSection = createStatsSection(user.wins, user.losses);
    const twoFASection = createTwoFASection(getCookie('2fa') === 'true');
    
    const friendsSection = createFriendsSection(friends);

    const historySection = createHistorySection(history);

    const leftColumn = document.createElement('div');
    leftColumn.className =
      'flex flex-col gap-8 w-full md:w-1/3 bg-black bg-opacity-55 p-10 rounded-lg shadow-2xl text-gray-100';
    leftColumn.append(avatarSection, usernameSection, statsSection, twoFASection);

    const rightColumn = document.createElement('div');
    rightColumn.className =
      'flex flex-col gap-8 w-full md:w-2/3 bg-black bg-opacity-50 p-10 rounded-lg shadow-2xl text-gray-100';
    rightColumn.append(friendsSection, historySection);

    container.append(leftColumn, rightColumn);
    root.appendChild(container);

    const navbar = await createNavbar();
    if (navbar) {
      root.appendChild(navbar);
    }
  } catch (error) {
    console.error('Error rendering profile page:', error);
    root.innerHTML =
      '<p class="text-red-500">Failed to load profile page. Please try again later.</p>';
    sessionStorage.clear();
    sessionStorage.setItem('initialized', 'false');
  }
}
