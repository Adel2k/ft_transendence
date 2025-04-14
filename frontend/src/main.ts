import { router } from './router.js';

window.addEventListener('DOMContentLoaded', () => {
  if (!sessionStorage.getItem('initialized')) {
    sessionStorage.clear();
    sessionStorage.setItem('initialized', 'true');
  }

  router();
  window.addEventListener('popstate', router);
});
