import { login } from './loginService.js';
import { validateLoginForm } from './loginValidation.js';

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
      alert(validationError);
      return;
    }

    try {
      const token = await login(email, password);
      localStorage.setItem('token', token);
      alert('Login successful!');
      history.pushState(null, '', '/home');
      import('../../router.js').then((m) => m.router());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert('Login failed: ' + errorMessage);
    }
  });

  registerButton.addEventListener('click', () => {
    history.pushState(null, '', '/register');
    import('../../router.js').then((m) => m.router());
  });
}