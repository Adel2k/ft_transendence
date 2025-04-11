
export function router() {
    const app = document.getElementById('app')
    const path = window.location.pathname
  
    switch (path) {
      case '/':
        import('./views/home').then(m => m.render(app!))
        break
      case '/login':
        import('./views/login').then(m => m.render(app!))
        break
      case '/game':
        import('./views/game').then(m => m.render(app!))
        break
      default:
        app!.innerHTML = '<h1>404 Not Found</h1>'
    }
  }
  