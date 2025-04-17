import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

export function createPaddles(scene: Scene) {
    const create = (name: string, color: Color3, x: number) => {
        const paddle = MeshBuilder.CreateBox(name, { width: 1.5, height: 0.2, depth: 0.5 }, scene);
        paddle.position = new Vector3(x, 0.35, 0);
        paddle.rotation.y = Math.PI / 2;
        const mat = new StandardMaterial(`${name}Mat`, scene);
        mat.diffuseColor = color;
        paddle.material = mat;
        return paddle;
    };

    return {
        paddle1: create('paddle1', new Color3(1, 0, 0), -5),
        paddle2: create('paddle2', new Color3(0, 0, 1), 5),
    };
}
