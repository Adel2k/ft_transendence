import { Vector3, Mesh } from "@babylonjs/core";

export function setupInput(ball: Mesh) {
    let ballDirection = new Vector3(0, 0, 0);

    const keysPressed = {
        w: false,
        s: false,
        arrowUp: false,
        arrowDown: false,
    };

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
    };
}
