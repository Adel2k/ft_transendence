import { HemisphericLight, Vector3, Scene } from '@babylonjs/core';

export function createLighting(scene: Scene) {
    return new HemisphericLight('light', new Vector3(0, 1, 0), scene);
}
