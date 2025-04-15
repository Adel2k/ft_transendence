import { showNotification } from '../../components/notification.js';
import { setCookie } from '../../utils/cookies.js';

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
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      if (is2FAEnabled) {
        const code = prompt('Enter your 2FA code to disable:');
        const response = await fetch('/api/2fa/off', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to disable 2FA');
        }

        showNotification('2FA disabled successfully!', 'success');
        setCookie('2fa', 'false');
        window.location.reload();
      } else {
        const response = await fetch('/api/2fa/on', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to generate 2FA setup');
        }

        const { qr, base32 } = JSON.parse(await response.text());
        console.log('base code:', base32);
        const qrImage = document.createElement('img');
        qrImage.src = qr;
        qrImage.alt = 'Scan this QR code with your authenticator app';
        container.appendChild(qrImage);

        const code = prompt('Enter the code from your authenticator app:');
        const enableResponse = await fetch('/api/2fa/on', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        });

        if (!enableResponse.ok) {
          throw new Error('Failed to enable 2FA');
        }

        showNotification('2FA enabled successfully!', 'success');
        setCookie('2fa', 'true');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      showNotification('Failed to toggle 2FA. Please try again.', 'error');
    }
  });

  container.appendChild(toggleLabel);
  container.appendChild(toggleButton);

  return container;
}