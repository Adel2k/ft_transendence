export function createFriendsSection(friends: Array<{ username: string; isOnline: boolean; avatarUrl: string }>): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const title = document.createElement('h2');
  title.textContent = 'Friends';
  title.className = 'text-xl font-bold';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = `flex overflow-x-scroll gap-4 w-full p-4 scrollbar-transparent scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`;
  
  friends.forEach((friend) => {
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

  container.appendChild(title);
  container.appendChild(scrollContainer);

  return container;
}