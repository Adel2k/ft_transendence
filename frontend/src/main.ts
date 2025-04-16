import './styles/input.css';
import { router } from './router';

window.addEventListener('DOMContentLoaded', () => {
  if (!sessionStorage.getItem('initialized')) {
    sessionStorage.clear();
    sessionStorage.setItem('initialized', 'true');
  }

  router();
  window.addEventListener('popstate', router);
});
