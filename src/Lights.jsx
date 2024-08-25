import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lights() {
    const lightRef = useRef(null);

    useFrame((state) => {
        // We are basically trying to fix the issue where the shadow, after the player moves for a bit, disappears, so we are basically trying to make the light follow the player along the z axis
        // We are also subtracting 4 to both the light position and the target in order to move both a bit forward
        lightRef.current.position.z = state.camera.position.z + 1 - 4; // the + 1 makes the shadow spawn a bit backwards
        lightRef.current.target.position.z = state.camera.position.z - 4; // The target of the light, unless it's visible to the scene, will cause the matrices to not be updated by Three.jsx because that's just how it works, if an object isn't visible the matrices won't be updated so this line of code won't be enough
        lightRef.current.target.updateMatrixWorld(); // This line fixes the issue mentioned above, so the shadow of the marble now works correctly
    });

    return (
        <>
            <directionalLight
                ref={lightRef}
                castShadow
                position={[4, 4, 1]}
                intensity={4.5}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={10}
                shadow-camera-right={10}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}
            />
            <ambientLight intensity={1.5} />
        </>
    );
}
