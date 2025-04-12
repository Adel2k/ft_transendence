export function createNavbar(): HTMLElement {
    const nav = document.createElement('nav');
    nav.className = 'p-4 bg-gray-800 flex gap-4';
  
    const links = [
      { href: '/', label: 'Home' },
      { href: '/login', label: 'Login' },
      { href: '/game', label: 'Game' }
    ];
  
    links.forEach(({ href, label }) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      a.className = 'text-white hover:underline cursor-pointer';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', href);
        import('../router.js').then(m => m.router());
    });
      nav.appendChild(a);
    });
  
    return nav;
  }
  