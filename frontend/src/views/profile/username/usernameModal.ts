import { showNotification } from '../../../components/notification';

export function createUsernameModal(
  currentUsername: string,
  onSave: (newUsername: string) => Promise<void>
): HTMLElement {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50';

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col gap-4';

  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'Edit Username';
  modalTitle.className = 'text-xl font-bold text-gray-700';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentUsername;
  input.className =
    'border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black';

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.className =
    'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className =
    'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded';

  saveButton.addEventListener('click', async () => {
    const newUsername = input.value.trim();
    if (!newUsername) {
      showNotification('Username cannot be empty.', 'error');
      return;
    }

    try {
      await onSave(newUsername);
      modal.classList.add('hidden');
    } catch (error) {
      console.error('Error saving username:', error);
      showNotification('Failed to update username. Please try again.', 'error');
    }
  });

  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(input);
  modalContent.appendChild(saveButton);
  modalContent.appendChild(cancelButton);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  return modal;
}
