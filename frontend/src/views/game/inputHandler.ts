import { Vector3, Mesh } from "@babylonjs/core";

export function setupInput(ball: Mesh) {
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
        if (z > 0.03) z = 0.03;
        else if (z < -0.03) z = -0.03;
        return new Vector3(x, 0, z);
    }

    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "KeyW":
                keysPressed.w = true;
                break;
            case "KeyS":
                keysPressed.s = true;
                break;
            case "ArrowUp":
                keysPressed.arrowUp = true;
                break;
            case "ArrowDown":
                keysPressed.arrowDown = true;
                break;
            case "Space":
                if (!isBallMoving) {
                    ballDirection = getRandomDirection();
                    isBallMoving = true;
                }
                break;
        }

        if (
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
                event.code
            )
        ) {
            event.preventDefault();
        }
    });

    window.addEventListener("keyup", (event) => {
        switch (event.code) {
            case "KeyW":
                keysPressed.w = false;
                break;
            case "KeyS":
                keysPressed.s = false;
                break;
            case "ArrowUp":
                keysPressed.arrowUp = false;
                break;
            case "ArrowDown":
                keysPressed.arrowDown = false;
                break;
        }
    });

    return {
        keysPressed,
        getBallDirection: () => ballDirection,
        setBallDirection: (dir: Vector3) => (ballDirection = dir),
        isBallMoving: () => isBallMoving,
        setBallMoving: (val: boolean) => (isBallMoving = val),
    };
}
