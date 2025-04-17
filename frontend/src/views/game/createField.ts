import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

export function createField(scene: Scene) {
    const ground = MeshBuilder.CreateBox('ground', { width: 10, height: 0.5, depth: 6 }, scene);
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new Color3(0.2, 0.6, 0.2);
    groundMat.specularColor = new Color3(0, 0, 0);
    ground.material = groundMat;

    const lines = [
        { name: 'center', width: 0.1, depth: 6, x: 0 },
        { name: 'left', width: 0.24, depth: 6.1, x: 5.12 },
        { name: 'right', width: 0.24, depth: 6.1, x: -5.12 },
        { name: 'top', width: 10, depth: 0.1, z: -3 },
        { name: 'bottom', width: 10, depth: 0.1, z: 3 },
    ];

    lines.forEach(({ name, width, depth, x = 0, z = 0 }) => {
        const line = MeshBuilder.CreateBox(`${name}Line`, { width, height: 0.51, depth }, scene);
        line.position = new Vector3(x, 0.01, z);
        const mat = new StandardMaterial(`${name}Material`, scene);
        mat.diffuseColor = name === 'center' || name === 'top' || name === 'bottom' ? new Color3(1, 1, 1) : new Color3(0.25, 0.25, 0.25);
        line.material = mat;
    });
}
