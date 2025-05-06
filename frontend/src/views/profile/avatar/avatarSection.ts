import { showNotification } from '../../../components/notification';
import { validateFile } from './validateFile';
import { uploadAvatar } from './avatarUpload';
import { deleteAvatar } from './avatarDelete';

export function createAvatarSection(avatarUrl: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const avatar = document.createElement('img');
  avatar.src = avatarUrl;
  avatar.alt = 'Avatar';
  avatar.className = 'w-32 h-32 rounded-full shadow-lg border-4 border-gray-300 ml-8';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex items-center gap-4';

  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload Avatar';
  uploadButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-8';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.className = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.className = 'hidden';

  uploadButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      showNotification(error, 'error');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      showNotification('Uploading avatar...', 'info');
      const newAvatarUrl = await uploadAvatar(file, token);
      avatar.src = newAvatarUrl;
      showNotification('Avatar uploaded successfully!', 'success');
      window.location.reload();
    } catch (error: any) {
      showNotification(`Failed to upload avatar. ${error.message}`, 'error');
    }
  });

  deleteButton.addEventListener('click', async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');

      showNotification('Deleting avatar...', 'info');
      await deleteAvatar(token, avatarUrl);
      avatar.src = '';
      showNotification('Avatar deleted successfully!', 'success');
      window.location.reload();
    } catch (error: any) {
      showNotification(`${error.message}. Please try again.`, 'error');
    }
  });

  buttonContainer.append(uploadButton, deleteButton);
  container.append(avatar, buttonContainer, fileInput);
  return container;
}
