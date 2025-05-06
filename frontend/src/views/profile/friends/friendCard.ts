export function createFriendCard(username: string, isOnline: boolean, avatarUrl: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'flex flex-col items-center gap-4 min-w-[135px]';
  
    const avatar = document.createElement('img');
    avatar.src = avatarUrl;
    avatar.alt = `${username}'s avatar`;
    avatar.className = 'w-28 h-28 rounded-full border-2';
    avatar.style.borderColor = isOnline ? 'green' : 'darkred';
  
    const name = document.createElement('span');
    name.textContent = username;
    name.className = `text-sm font-medium ${isOnline ? 'text-green-500' : 'text-red-700'}`;
  
    card.appendChild(avatar);
    card.appendChild(name);
  
    return card;
}
  