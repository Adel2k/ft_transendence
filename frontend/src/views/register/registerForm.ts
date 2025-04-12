import { register } from './registerService.js';

export function setupRegisterForm(root: HTMLElement) {
  const form = root.querySelector('#register-form') as HTMLFormElement;
  const loginButton = root.querySelector('#login-button') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

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