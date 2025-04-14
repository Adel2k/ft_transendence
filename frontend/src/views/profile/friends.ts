export function createFriendsSection(friends: Array<{ username: string; isOnline: boolean }>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Friends';
  title.className = 'text-xl font-bold';

  const list = document.createElement('ul');
  list.className = 'w-full';

  friends.forEach((friend) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${friend.username} (${friend.isOnline ? 'Online' : 'Offline'})`;
    listItem.className = `p-2 rounded ${friend.isOnline ? 'bg-green-500' : 'bg-gray-500'} text-white`;
    list.appendChild(listItem);
  });

  container.appendChild(title);
  container.appendChild(list);

  return container;
}