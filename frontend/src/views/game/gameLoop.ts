import { Vector3, Engine, Scene, Mesh } from "@babylonjs/core";
import { getWebSocket } from '../../utils/socket';
import { setupInput } from "./inputHandler";

export function runGameLoop(
    engine: Engine,
    scene: Scene,
    paddle1: Mesh,
    paddle2: Mesh,
    ball: Mesh,
    role: string
) {
    const input = setupInput(ball);
    const paddleSpeed = 0.1;

    function sendPaddlePosition(role: string, z: number) {
        const socket = getWebSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'paddle_move',
                role,
                z
            }));
        }
    }

    window.addEventListener('paddle_move', (e: Event) => {
        const { role: senderRole, z } = (e as CustomEvent).detail;
        if (senderRole === role) return;
        if (senderRole === 'player1') {
            paddle1.position.z = z;
        } else if (senderRole === 'player2') {
            paddle2.position.z = z;
        }
    });

    window.addEventListener('ball_update', (e: Event) => {
        const { position } = (e as CustomEvent).detail;
        ball.position.x = position.x;
        ball.position.z = position.z;
    });

    let stop = false;
    window.addEventListener('stop_ball', () => {
        stop = true;
    });

    engine.runRenderLoop(() => {
        if (stop) return; // Останавливаем обновление мяча и сцену

        if (role === 'player1') {
            const { w, s, arrowUp, arrowDown } = input.keysPressed;
            if ((s || arrowDown) && paddle1.position.z > -2.2) {
                paddle1.position.z -= paddleSpeed;
                sendPaddlePosition(role, paddle1.position.z);
            }
            if ((w || arrowUp) && paddle1.position.z < 2.2) {
                paddle1.position.z += paddleSpeed;
                sendPaddlePosition(role, paddle1.position.z);
            } 
        }
        if (role === 'player2') {
            const { w, s, arrowUp, arrowDown } = input.keysPressed;
            if ((s || arrowDown) && paddle2.position.z > -2.2) {
                paddle2.position.z -= paddleSpeed;
                sendPaddlePosition(role, paddle2.position.z);
            } 
            if ((w || arrowUp) && paddle2.position.z < 2.2) {
                paddle2.position.z += paddleSpeed;
                sendPaddlePosition(role, paddle2.position.z);
            }
        }

        scene.render();
    });
}
