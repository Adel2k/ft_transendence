import { createPongGame } from './pong';
import { createNavbar } from '../../components/navbars';

export async function render(root: HTMLElement) {
    root.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.className = 'w-full h-full';
    root.appendChild(canvas);

    createPongGame(canvas);

    const navbar = await createNavbar();
    if (navbar) {
        root.appendChild(navbar);
    }
}