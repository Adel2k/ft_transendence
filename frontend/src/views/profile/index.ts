import { createNavbar } from '../../components/navbars.js';
import { createAvatarSection } from './avatar.js';
import { createUsernameSection } from './username.js';
import { createStatsSection } from './stats.js';
import { createTwoFASection } from './twofa.js';
import { createFriendsSection } from './friends.js';
import { createHistorySection } from './history.js';

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

    const avatarResponse = await fetch('/api/user/avatar', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    });
    if (!avatarResponse.ok) throw new Error('Failed to update avatar');
    const { avatarUrl } = await avatarResponse.json();

    const response = await fetch('/api/user/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    const { user } = await response.json();

    const avatarSection = createAvatarSection(user.avatarUrl);
    const usernameSection = createUsernameSection(user.username);
    const statsSection = createStatsSection(user.wins, user.losses);
    const twoFASection = createTwoFASection(user.is2faEnabled);

    const friendsResponse = await fetch('/api/user/friends', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!friendsResponse.ok) throw new Error('Failed to fetch friends');
    const { friends } = await friendsResponse.json();
    const friendsSection = createFriendsSection(friends);

    const historyResponse = await fetch('/api/user/history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!historyResponse.ok) throw new Error('Failed to fetch match history');
    const { history } = await historyResponse.json();
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
