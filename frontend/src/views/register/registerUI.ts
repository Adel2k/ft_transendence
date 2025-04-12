export function createRegisterUI(): HTMLElement {
  const div = document.createElement('div');
  div.className = 'flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-fade-bg';

  div.innerHTML = `
    <div class="bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
      <h1 class="text-3xl font-bold text-center text-white mb-6">Register</h1>
      <form id="register-form" class="flex flex-col gap-4">
        <div class="relative">
          <input id="email" type="email" placeholder="Email" class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="relative">
          <input id="username" type="text" placeholder="Username" class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="relative">
          <input id="password" type="password" placeholder="Password" class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">Register</button>
      </form>
      <button id="login-button" class="mt-4 text-blue-300 hover:text-blue-500 transition duration-300 underline">Already have an account? Login</button>
    </div>
  `;
  return div;
}