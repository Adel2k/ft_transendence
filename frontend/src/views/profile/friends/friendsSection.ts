import { createFriendCard } from './friendCard';
import { openAddFriendModal } from './friendOpenAppModal';

export function createFriendsSection(friends: Array<{ username: string; isOnline: boolean; avatarUrl: string }>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Friends';
  title.className = 'text-xl font-bold';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'scroll-container flex gap-4 overflow-x-auto';

  friends
    .sort((a, b) => Number(b.isOnline) - Number(a.isOnline))
    .forEach(friend => {
      const card = createFriendCard(friend.username, friend.isOnline, friend.avatarUrl);
      scrollContainer.appendChild(card);
    });

  const addFriendButton = document.createElement('button');
  addFriendButton.textContent = 'Add Friend';
  addFriendButton.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4';

  const modal = openAddFriendModal();
  addFriendButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  container.append(title, scrollContainer, addFriendButton, modal);
  return container;
}
