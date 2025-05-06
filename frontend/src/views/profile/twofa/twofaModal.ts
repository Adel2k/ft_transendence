export function createTwoFAModal(): {
    modal: HTMLElement;
    title: HTMLElement;
    input: HTMLInputElement;
    verifyButton: HTMLButtonElement;
    cancelButton: HTMLButtonElement;
    qrImage: HTMLImageElement;
} {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50';

    const content = document.createElement('div');
    content.className = 'bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col gap-4';

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-gray-700';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter 2FA Code';
    input.className = 'w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black';

    const qrImage = document.createElement('img');
    qrImage.className = 'w-full h-auto rounded';

    const verifyButton = document.createElement('button');
    verifyButton.textContent = 'Submit';
    verifyButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded';

    content.append(title, input, verifyButton, cancelButton);
    modal.appendChild(content);
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    return { modal, title, input, verifyButton, cancelButton, qrImage };
}
  