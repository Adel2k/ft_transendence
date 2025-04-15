export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = `
    fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white
    ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}
  `;
  notification.style.zIndex = '1000';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}