import { createUsernameModal } from './usernameModal';
import { onUsernameSave } from './usernameController';

export function createUsernameSection(username: string, avatarURL: string, id: Number): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const usernameDisplay = document.createElement('p');
  usernameDisplay.textContent = `Username: ${username}`;
  usernameDisplay.className = 'text-lg font-bold text-white-700 ml-8';

  const idDisplay = document.createElement('p');
  idDisplay.textContent = `ID: ${id}`;
  idDisplay.className = 'text-md text-white-500 ml-8';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Username';
  editButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-8';

  const modal = createUsernameModal(username, async (newUsername: string) => {
    await onUsernameSave(newUsername, avatarURL, usernameDisplay);
  });

  editButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  container.appendChild(usernameDisplay);
  container.appendChild(idDisplay);
  container.appendChild(editButton);

  return container;
}
