import { showNotification } from '../../components/notification';
import { getCookie } from '../../utils/cookies';

export function createFriendsSection(friends: Array<{ username: string; isOnline: boolean; avatarUrl: string }>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Friends';
  title.className = 'text-xl font-bold';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = `scroll-container flex gap-4 overflow-x-auto`;
  friends
    .sort((a, b) => Number(b.isOnline) - Number(a.isOnline))
    .forEach((friend) => {
      const friendCard = document.createElement('div');
      friendCard.className = 'flex flex-col items-center gap-4 min-w-[135px]';

      const avatar = document.createElement('img');
      avatar.src = friend.avatarUrl;
      avatar.alt = `${friend.username}'s avatar`;
      avatar.className = 'w-28 h-28 rounded-full border-2';
      avatar.style.borderColor = friend.isOnline ? 'green' : 'darkred';

      const name = document.createElement('span');
      name.textContent = friend.username;
      name.className = `text-sm font-medium ${friend.isOnline ? 'text-green-500' : 'text-red-700'}`;

      friendCard.appendChild(avatar);
      friendCard.appendChild(name);
      scrollContainer.appendChild(friendCard);
    });

  const addFriendButton = document.createElement('button');
  addFriendButton.textContent = 'Add Friend';
  addFriendButton.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4';

  const modal = openAddFriendModal();

  addFriendButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  container.appendChild(title);
  container.appendChild(scrollContainer);
  container.appendChild(addFriendButton);
  container.appendChild(modal);

  return container;
}

function openAddFriendModal() {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add friend.');
      }

      showNotification('Friend added successfully!', 'success');
      modal.classList.add('hidden');
      window.location.reload();
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  });

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className = 'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded';
  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modalContent.appendChild(title);
  modalContent.appendChild(input);
  modalContent.appendChild(addButton);
  modalContent.appendChild(cancelButton);
  modal.appendChild(modalContent);

  return modal;
}
