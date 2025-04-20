import { showNotification } from '../../components/notification';
import { setCookie } from '../../utils/cookies';

export function createTwoFASection(is2FAEnabled: boolean): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center gap-4';

  const toggleLabel = document.createElement('p');
  toggleLabel.textContent = `2FA is currently ${is2FAEnabled ? 'Enabled' : 'Disabled'}`;
  toggleLabel.className = 'text-lg font-bold ml-8';

  const toggleButton = document.createElement('button');
  toggleButton.textContent = is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA';
  toggleButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded  ml-8';

  const modal = document.createElement('div');
  modal.id = 'twofa-modal';
  modal.className =
    'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50';

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col gap-4';

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'text-xl font-bold text-gray-700';

  const twofaCodeInput = document.createElement('input');
  twofaCodeInput.id = 'twofa-code';
  twofaCodeInput.type = 'text';
  twofaCodeInput.placeholder = 'Enter 2FA Code';
  twofaCodeInput.className =
    'w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black';

  const qrImage = document.createElement('img');
  qrImage.className = 'w-full h-auto rounded';

  const verifyButton = document.createElement('button');
  verifyButton.textContent = 'Submit';
  verifyButton.className =
    'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.className =
    'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded';

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(twofaCodeInput);
  modalContent.appendChild(verifyButton);
  modalContent.appendChild(cancelButton);
  modal.appendChild(modalContent);
  modal.classList.add('hidden');
  container.appendChild(modal);

  toggleButton.addEventListener('click', async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      if (is2FAEnabled) {
        modalTitle.textContent = 'Disable 2FA';
        qrImage.style.display = 'none';
        modal.classList.remove('hidden');

        verifyButton.onclick = async () => {
          const code = twofaCodeInput.value.trim();
          if (!code) {
            showNotification('Please enter your 2FA code.', 'error');
            return;
          }

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
          modal.classList.add('hidden');
          window.location.reload();
        };
      } else {
        const response = await fetch('/api/2fa/on', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to generate 2FA setup');
        }

        const { qr } = await response.json();

        modalTitle.textContent = 'Enable 2FA';
        qrImage.src = qr;
        qrImage.alt = 'Scan this QR code with your authenticator app';
        qrImage.style.display = 'block';
        modalContent.insertBefore(qrImage, twofaCodeInput);
        modal.classList.remove('hidden');

        verifyButton.onclick = async () => {
          const code = twofaCodeInput.value.trim();
          if (!code) {
            showNotification('Please enter the code from your authenticator app.', 'error');
            return;
          }

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
          modal.classList.add('hidden');
          window.location.reload();
        };
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      showNotification('Failed to toggle 2FA. Please try again.', 'error');
    }
  });

  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  container.appendChild(toggleLabel);
  container.appendChild(toggleButton);

  return container;
}