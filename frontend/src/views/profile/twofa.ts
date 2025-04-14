export function createTwoFASection(is2FAEnabled: boolean): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const toggleLabel = document.createElement('p');
  toggleLabel.textContent = `2FA is currently ${is2FAEnabled ? 'Enabled' : 'Disabled'}`;
  toggleLabel.className = 'text-lg font-bold';

  const toggleButton = document.createElement('button');
  toggleButton.textContent = is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA';
  toggleButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
  toggleButton.addEventListener('click', async () => {
    alert(`2FA ${is2FAEnabled ? 'disabled' : 'enabled'}!`);
  });

  container.appendChild(toggleLabel);
  container.appendChild(toggleButton);

  return container;
}