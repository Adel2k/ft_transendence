import { getCookie } from '../../utils/cookies.js';
import { createLoginUI } from './loginUI.js';
import { setupLoginForm } from './loginForm.js';
import { showNotification } from '../../components/notification.js';

export async function render(root: HTMLElement) {
  if (!root) {
    console.error('Root element not found');
    return;
  }

  root.innerHTML = '';

  // const is2FAEnabled = getCookie('2fa') === 'true';

  const loginUI = createLoginUI();
  root.appendChild(loginUI);

  setupLoginForm(loginUI);

  // const twofaCodeInput = document.createElement('input');
  // twofaCodeInput.type = 'text';
  // twofaCodeInput.placeholder = 'Enter 2FA Code';
  // twofaCodeInput.className =
  //   'w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  // twofaCodeInput.style.display = is2FAEnabled ? 'block' : 'none';
  // root.appendChild(twofaCodeInput);

  // const verifyButton = document.createElement('button');
  // verifyButton.textContent = 'Verify 2FA';
  // verifyButton.className =
  //   'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
  // verifyButton.style.display = is2FAEnabled ? 'block' : 'none';
  // root.appendChild(verifyButton);

  // verifyButton.addEventListener('click', async () => {
  //   const code = twofaCodeInput.value.trim();
  //   if (!code) {
  //     showNotification('Please enter your 2FA code.', 'error');
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/auth/2fa-verify', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ token: getCookie('token'), code }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Invalid 2FA code');
  //     }

  //     const { token } = await response.json();
  //     localStorage.setItem('token', token);
  //     showNotification('2FA verified successfully!', 'success');
  //     history.pushState(null, '', '/home');
  //     import('../home/index.js').then((m) => m.render(root));
  //   } catch (error) {
  //     console.error('Error verifying 2FA:', error);
  //     showNotification('Failed to verify 2FA. Please try again.', 'error');
  //   }
  // });
}