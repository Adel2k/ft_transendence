import { Engine, Scene }    from '@babylonjs/core';
import { createCamera }     from './createCamera';
import { createLighting }   from './createLighting';
import { createField }      from './createField';
import { createBall }       from './createBall';
import { createPaddles }    from './createPaddles';
import { runGameLoop }      from './gameLoop';

export function createPongScene(canvas: HTMLCanvasElement, options?: { role: string, match: any }) {
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = createCamera(scene, canvas);
    createLighting(scene);
    const ball = createBall(scene);
    const { paddle1, paddle2 } = createPaddles(scene);
    createField(scene);

    // Передаем роль в gameLoop
    runGameLoop(engine, scene, paddle1, paddle2, ball, options?.role);

    window.addEventListener('resize', () => {
        engine.resize();
    });
}
