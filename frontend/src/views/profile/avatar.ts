export function createAvatarSection(avatarUrl: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const avatar = document.createElement('img');
  avatar.src = avatarUrl;
  avatar.alt = 'Avatar';
  avatar.className = 'w-32 h-32 rounded-full shadow-lg border-4 border-gray-300';

  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload Avatar';
  uploadButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
  uploadButton.addEventListener('click', async () => {
    alert('Avatar upload functionality coming soon!');
  });

  container.appendChild(avatar);
  container.appendChild(uploadButton);

  return container;
}