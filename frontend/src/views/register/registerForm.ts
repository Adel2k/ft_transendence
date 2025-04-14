import { register } from './registerService.js';
import { validateRegisterForm } from './registerValidation.js';
import { showNotification } from '../../components/notification.js';

export function setupRegisterForm(root: HTMLElement) {
  const form = root.querySelector('#register-form') as HTMLFormElement;
  const loginButton = root.querySelector('#login-button') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const validationError = validateRegisterForm(email, username, password);
    if (validationError) {
      showNotification(validationError, 'error');
      return;
    }

    try {
      await register(email, username, password);
      showNotification('Registration successful! Please log in.', 'success');
      history.pushState(null, '', '/');
      import('../../router.js').then((m) => m.router());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      showNotification('Registration failed: ' + errorMessage, 'error');
    }
  });

  loginButton.addEventListener('click', () => {
    history.pushState(null, '', '/');
    import('../../router.js').then((m) => m.router());
  });
}