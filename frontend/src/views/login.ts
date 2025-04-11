export function render(root: HTMLElement) {
    root.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <form id="login-form" class="flex flex-col gap-4 w-64">
          <input type="text" placeholder="Username" class="p-2 rounded bg-gray-800 border border-gray-700" required>
          <input type="password" placeholder="Password" class="p-2 rounded bg-gray-800 border border-gray-700" required>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 rounded p-2">Login</button>
        </form>
      </div>
    `
  
    const form = document.getElementById('login-form') as HTMLFormElement
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      // TODO: auth logic
      alert('Logging in (stub)')
    })
  }
  