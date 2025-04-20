import { showNotification } from '../../components/notification';

function validateFile(file: File): string | null {
  if (file.size > 3 * 1024 * 1024) {
    return 'File size must not exceed 3 MB.';
  }

  if (!file.type.startsWith('image/')) {
    return 'Invalid file type. Please upload an image.';
  }

  return null;
}

async function uploadAvatar(file: File, token: string) {
  const formData = new FormData();
  formData.append('avatar', file, file.name);

  const response = await fetch('/api/user/avatar', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload avatar');
  }

  const { avatarUrl } = await response.json();
  return avatarUrl;
}

async function deleteAvatar(token: string, avatarUrl: string) {
  if (avatarUrl.startsWith('/avatars/')) {
    const avatarResponse = await fetch('/api/user/avatar', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    });

    if (!avatarResponse.ok) {
      throw new Error('Failed to delete avatar');
    }
  } else {
    throw new Error('Cannot delete default avatar');
  }
}

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

    const validationError = validateFile(file);
    if (validationError) {
      showNotification(validationError, 'error');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      showNotification('Uploading avatar...', 'info');
      const newAvatarUrl = await uploadAvatar(file, token);
      avatar.src = newAvatarUrl;
      showNotification('Avatar uploaded successfully!', 'success');
      window.location.reload();
    } catch (error) {
      showNotification('Failed to upload avatar. Please try again.', 'error');
    }
  });

  deleteButton.addEventListener('click', async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      showNotification('Deleting avatar...', 'info');
      await deleteAvatar(token, avatarUrl);
      avatar.src = '';
      showNotification('Avatar deleted successfully!', 'success');
      window.location.reload();
    } catch (error) {
      showNotification(error + '. Please try again.', 'error');
    }
  });

  buttonContainer.appendChild(uploadButton);
  buttonContainer.appendChild(deleteButton);

  container.appendChild(avatar);
  container.appendChild(buttonContainer);
  container.appendChild(fileInput);

  return container;
}
