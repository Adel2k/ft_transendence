import { createPongScene } from './createScene';
import { createNavbar } from '../../components/navbars';

export async function render(root: HTMLElement, options?: { role: string, match: any }) {
    root.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.className = 'w-screen h-screen';
    root.appendChild(canvas);

    createPongScene(canvas, options);

    const navbar = await createNavbar();
    if (navbar) {
        root.appendChild(navbar);
    }
}