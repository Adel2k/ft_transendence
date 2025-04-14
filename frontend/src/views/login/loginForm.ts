import { login } from './loginService.js';
import { validateLoginForm } from './loginValidation.js';
import { showNotification } from '../../components/notification.js';

export function setupLoginForm(root: HTMLElement) {
  const form = root.querySelector('#login-form') as HTMLFormElement;
  const registerButton = root.querySelector('#register-button') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const validationError = validateLoginForm(email, password);
    if (validationError) {
      showNotification(validationError, 'error');
      return;
    }

    try {
      const token = await login(email, password);
      localStorage.setItem('token', token);
      showNotification('Login successful!', 'success');
      history.pushState(null, '', '/home');
      import('../../router.js').then((m) => m.router());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      showNotification('Login failed: ' + errorMessage, 'error');
    }
  });

  registerButton.addEventListener('click', () => {
    history.pushState(null, '', '/register');
    import('../../router.js').then((m) => m.router());
  });
}