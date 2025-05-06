import { connectToWebSocket } from '../../utils/socket';
import { getCookie, setCookie } from '../../utils/cookies';
import { showNotification } from '../../components/notification';

export function createTwoFAModal(root: HTMLElement, onSuccess: () => void): void {
  const modal = document.createElement('div');
  modal.id = 'twofa-modal';
  modal.className =
    'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50';

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col gap-4';

  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'Enter 2FA Code';
  modalTitle.className = 'text-xl font-bold text-gray-700';

  const twofaCodeInput = document.createElement('input');
  twofaCodeInput.id = 'twofa-code';
  twofaCodeInput.type = 'text';
  twofaCodeInput.placeholder = 'Enter 2FA Code';
  twofaCodeInput.className =
    'w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black';

  const verifyButton = document.createElement('button');
  verifyButton.id = 'verify-2fa-button';
  verifyButton.textContent = 'Verify 2FA';
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
  root.appendChild(modal);

  verifyButton.addEventListener('click', async () => {
    const code = twofaCodeInput.value.trim();
    if (!code) {
      showNotification('Please enter your 2FA code.', 'error');
      return;
    }
    const tempToken = getCookie('token');
    if (!tempToken) {
      showNotification('No token found. Please log in again.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/auth/2fa-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tempToken, code }),
      });

      if (!response.ok) {
        throw new Error('Invalid 2FA code');
      }

      const { token } = await response.json();
      setCookie('token', token);
      setCookie('2faCode', 'true');
      showNotification('2FA verified successfully!', 'success');
      modal.classList.add('hidden');
      connectToWebSocket(token);
      onSuccess();
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      showNotification('Failed to verify 2FA. Please try again.', 'error');
    }
  });

  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}