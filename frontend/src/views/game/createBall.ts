import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3, Mesh } from '@babylonjs/core';

export function createBall(scene: Scene): Mesh {
    const ball = MeshBuilder.CreateSphere('ball', { diameter: 0.35 }, scene);
    ball.position = new Vector3(0, 0.435, 0);
    const material = new StandardMaterial('ballMat', scene);
    material.diffuseColor = new Color3(1, 0.5, 0);
    ball.material = material;
    return ball;
}
