import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    MeshBuilder,
    Vector3,
    StandardMaterial,
    Color3,
} from '@babylonjs/core';

export function createPongGame(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3, 20, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.upperBetaLimit = Math.PI / 2;
    camera.inputs.removeByType('ArcRotateCameraKeyboardMoveInput');

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    const ground = MeshBuilder.CreateBox('ground', { width: 10, height: 0.5, depth: 6 }, scene);
    const groundMaterial = new StandardMaterial('groundMaterial', scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.6, 0.2);
    groundMaterial.specularColor = new Color3(0, 0, 0);
    ground.material = groundMaterial;

    const centerLine = MeshBuilder.CreateBox('centerLine', { width: 0.1, height: 0.51, depth: 6 }, scene);
    centerLine.position = new Vector3(0, 0.01, 0);
    const centerLineMaterial = new StandardMaterial('centerLineMaterial', scene);
    centerLineMaterial.diffuseColor = new Color3(1, 1, 1);
    centerLine.material = centerLineMaterial;

    const topLine = MeshBuilder.CreateBox('topLine', { width: 10, height: 0.51, depth: 0.1 }, scene);
    topLine.position = new Vector3(0, 0.01, -3);
    const topLineMaterial = new StandardMaterial('topLineMaterial', scene);
    topLineMaterial.diffuseColor = new Color3(1, 1, 1);
    topLine.material = topLineMaterial;

    const bottomLine = MeshBuilder.CreateBox('bottomLine', { width: 10, height: 0.51, depth: 0.1 }, scene);
    bottomLine.position = new Vector3(0, 0.01, 3);
    const bottomLineMaterial = new StandardMaterial('bottomLineMaterial', scene);
    bottomLineMaterial.diffuseColor = new Color3(1, 1, 1);
    bottomLine.material = bottomLineMaterial;

    const ball = MeshBuilder.CreateSphere('ball', { diameter: 0.35 }, scene);
    ball.position = new Vector3(0, 0.435, 0);
    const ballMaterial = new StandardMaterial('ballMaterial', scene);
    ballMaterial.diffuseColor = new Color3(1, 0.5, 0);
    ball.material = ballMaterial;

    const paddle1 = MeshBuilder.CreateBox('paddle1', { width: 1.5, height: 0.2, depth: 0.5 }, scene);
    paddle1.position = new Vector3(-4.5, 0.35, 0);
    paddle1.rotation.y = Math.PI / 2;
    const paddle1Material = new StandardMaterial('paddle1Material', scene);
    paddle1Material.diffuseColor = new Color3(1, 0, 0);
    paddle1.material = paddle1Material;

    const paddle2 = MeshBuilder.CreateBox('paddle2', { width: 1.5, height: 0.2, depth: 0.5 }, scene);
    paddle2.position = new Vector3(4.5, 0.35, 0);
    paddle2.rotation.y = Math.PI / 2;
    const paddle2Material = new StandardMaterial('paddle2Material', scene);
    paddle2Material.diffuseColor = new Color3(0, 0, 1);
    paddle2.material = paddle2Material;

    let ballDirection = new Vector3(0, 0, 0);
    let isBallMoving = false;

    const keysPressed = {
        w: false,
        s: false,
        arrowUp: false,
        arrowDown: false,
    };

    function getRandomDirection(): Vector3 {
        const x = Math.random() > 0.5 ? 0.05 : -0.05;
        let z = (Math.random() * 0.1) - 0.05;
        if (z > 0.03) {
            z = 0.03;
        } else if (z < -0.03) {
            z = -0.03;
        }
        return new Vector3(x, 0, z);
    }

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyW') keysPressed.w = true;
        if (event.code === 'KeyS') keysPressed.s = true;
        if (event.code === 'ArrowUp') keysPressed.arrowUp = true;
        if (event.code === 'ArrowDown') keysPressed.arrowDown = true;
        if (event.code === 'Space' && !isBallMoving) {
            ballDirection = getRandomDirection();
            isBallMoving = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.code === 'KeyW') keysPressed.w = false;
        if (event.code === 'KeyS') keysPressed.s = false;
        if (event.code === 'ArrowUp') keysPressed.arrowUp = false;
        if (event.code === 'ArrowDown') keysPressed.arrowDown = false;
    });

    window.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }
    });

    engine.runRenderLoop(() => {
        const paddleSpeed = 0.1;

        if (keysPressed.w && paddle2.position.z > -2.20) {
            paddle2.position.z -= paddleSpeed;
        }
        if (keysPressed.s && paddle2.position.z < 2.20) {
            paddle2.position.z += paddleSpeed;
        }

        if (keysPressed.arrowUp && paddle1.position.z > -2.20) {
            paddle1.position.z -= paddleSpeed;
        }
        if (keysPressed.arrowDown && paddle1.position.z < 2.20) {
            paddle1.position.z += paddleSpeed;
        }

        if (isBallMoving) {
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
                ballDirection = new Vector3(0, 0, 0);
                isBallMoving = false;
            }
        }

        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}
