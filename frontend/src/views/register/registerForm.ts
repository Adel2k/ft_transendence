import { register } from './registerService.js';
import { validateRegisterForm } from './registerValidation.js';

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
      alert(validationError);
      return;
    }

    try {
      await register(email, username, password);
      alert('Registration successful! Please log in.');
      history.pushState(null, '', '/');
      import('../../router.js').then((m) => m.router());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert('Registration failed: ' + errorMessage);
    }
  });

  loginButton.addEventListener('click', () => {
    history.pushState(null, '', '/');
    import('../../router.js').then((m) => m.router());
  });
}