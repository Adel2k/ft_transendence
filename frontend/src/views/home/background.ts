export function createBackground(): HTMLElement {
    const background = document.createElement('div');
    background.className = 'relative flex flex-col items-center justify-center min-h-screen bg-[#1a237e] text-white overflow-hidden';
    background.style.userSelect = 'none';

    return background;
}