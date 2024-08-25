import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface.js";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
    <KeyboardControls
        // We use KeyW, KeyS ecc, to cover the non-QWERTY keyboards as well, setting only w or s wouldn't work for these keyboards
        map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "jump", keys: ["Space"] },
        ]} // In the map array, we need to provide each key that we want to observe as an object with a name and the list of keys that should trigger the change as another array.
    >
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [2.5, 4, 6],
            }}
        >
            <Experience />
        </Canvas>
        <Interface />
    </KeyboardControls>
);
