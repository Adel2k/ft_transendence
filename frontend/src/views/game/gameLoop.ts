import { Vector3, Engine, Scene, Mesh } from "@babylonjs/core";
import { setupInput } from "./inputHandler";

export function runGameLoop(
    engine: Engine,
    scene: Scene,
    paddle1: Mesh,
    paddle2: Mesh,
    ball: Mesh
) {
    const input = setupInput(ball);
    const paddleSpeed = 0.1;

    engine.runRenderLoop(() => {
        const { w, s, arrowUp, arrowDown } = input.keysPressed;

        if (s && paddle1.position.z > -2.2) paddle1.position.z -= paddleSpeed;
        if (w && paddle1.position.z < 2.2) paddle1.position.z += paddleSpeed;

        if (arrowDown && paddle2.position.z > -2.2) paddle2.position.z -= paddleSpeed;
        if (arrowUp && paddle2.position.z < 2.2) paddle2.position.z += paddleSpeed;

        if (input.isBallMoving()) {
            const ballDirection = input.getBallDirection();
            ball.position.addInPlace(ballDirection);

            if (ball.position.z > 3 || ball.position.z < -3) {
                ballDirection.z *= -1;
            }

            if (ball.intersectsMesh(paddle1, false) && ballDirection.x < 0) {
                if (ball.position.x < paddle1.position.x + 0.435) {
                    const relativeZ = ball.position.z - paddle1.position.z;
                    ballDirection.x *= -1;
                    ballDirection.z += relativeZ * 0.05;
                }
            }

            if (ball.intersectsMesh(paddle2, false) && ballDirection.x > 0) {
                if (ball.position.x > paddle2.position.x - 0.435) {
                    const relativeZ = ball.position.z - paddle2.position.z;
                    ballDirection.x *= -1;
                    ballDirection.z += relativeZ * 0.05;
                }
            }

            if (ball.position.x > 5 || ball.position.x < -5) {
                ball.position = new Vector3(0, 0.435, 0);
                input.setBallDirection(new Vector3(0, 0, 0));
                input.setBallMoving(false);
            }
        }

        scene.render();
    });
}
