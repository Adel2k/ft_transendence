import { createUsernameModal } from './usernameUI';
import { showNotification } from '../../components/notification';

export function createUsernameSection(username: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const usernameDisplay = document.createElement('p');
  usernameDisplay.textContent = `Username: ${username}`;
  usernameDisplay.className = 'text-lg font-bold text-white-700 ml-8';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Username';
  editButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-8';

  const modal = createUsernameModal(username, async (newUsername) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('/api/user/username', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newUsername }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update username');
    }

    const avatarResponse = await fetch('/api/user/avatar', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    });
    if (!avatarResponse.ok) throw new Error('Failed to update avatar');

    usernameDisplay.textContent = `Username: ${newUsername}`;
    showNotification('Username updated successfully!', 'success');
    window.location.reload();
  });

  editButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  container.appendChild(usernameDisplay);
  container.appendChild(editButton);

  return container;
}