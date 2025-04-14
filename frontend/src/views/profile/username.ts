export function createUsernameSection(username: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const usernameDisplay = document.createElement('p');
  usernameDisplay.textContent = `Username: ${username}`;
  usernameDisplay.className = 'text-lg font-bold text-gray-700';

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Username';
  editButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
  editButton.addEventListener('click', async () => {
    const newUsername = prompt('Enter new username:', username);
    if (newUsername) {
      alert(`Username updated to: ${newUsername}`);
    }
  });

  container.appendChild(usernameDisplay);
  container.appendChild(editButton);

  return container;
}