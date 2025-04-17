import { ArcRotateCamera, Vector3, Scene } from '@babylonjs/core';

export function createCamera(scene: Scene, canvas: HTMLCanvasElement) {
    const camera = new ArcRotateCamera('camera', -Math.PI / 2, 0, 12, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.upperBetaLimit = Math.PI / 2;
    camera.inputs.removeByType('ArcRotateCameraKeyboardMoveInput');
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 25;

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyR') {
            camera.setPosition(new Vector3(0, 0, 12));
            camera.alpha = -Math.PI / 2;
            camera.beta = 0;
            camera.radius = 12;
            camera.target = Vector3.Zero();
        }
    });

    return camera;
}
