export function createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
    button.addEventListener('click', onClick);
    return button;
  }
  