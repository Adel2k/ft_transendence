import { showNotification } from '../../../components/notification';
import { getCookie } from '../../../utils/cookies';

export function openAddFriendModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50';

  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Add Friend';
  title.className = 'text-xl font-bold text-gray-700';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter Friend ID';
  input.className = 'w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add';
  addButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
  addButton.addEventListener('click', async () => {
    const token = getCookie('token');
    if (!token) {
      showNotification('You need to be logged in to add friends.', 'error');
      return;
    }

    const friendId = input.value.trim();
    if (!friendId) {
      showNotification('Please enter a valid Friend ID.', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/user/friends/${friendId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add friend.');
      }

      showNotification('Friend added successfully!', 'success');
      modal.classList.add('hidden');
      window.location.reload();
    } catch (error: any) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  });

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded';
  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modalContent.append(title, input, addButton, cancelButton);
  modal.appendChild(modalContent);
  return modal;
}
