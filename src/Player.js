import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

const Player = () => {
    const [subscribeKeys, getKeys] = useKeyboardControls(); // The 2 destructured functions: subscribeKeys is used to subscribe to key changes (useful to know when the jump key has been pressed), getKeys is a function used to get the current states of the keys (useful to know if the WASD keys are being pressed)
    const marbleRef = useRef();

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward } = getKeys();

        // We set 1 impulse and 1 torque with these values because sometimes the player could press 2 buttons while airborne like forward and then right for example and this makes it work right
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        // We use delta (time passed between each frame) in order to make the strength of the controls the same for all of the players, otherwise players with higher framerate would have a "stronger" ball movement
        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength; // To move towards the burger, the end of the level, the ball has to move on the z axis
            torque.x -= torqueStrength; // To move sideways, it moves on the x axis
        }
        if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }
        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }
        if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        marbleRef.current.applyImpulse(impulse);
        marbleRef.current.applyTorqueImpulse(torque);
    });

    return (
        <RigidBody
            ref={marbleRef}
            canSleep={false} // In the latest version of @react-three/rapier and rapier, a RigidBody falls asleep after a few seconds of inaction. This would result in the sphere not moving even though the player presses the arrow keys. The prop can sleep set to false fixes the issue
            colliders="ball"
            restitution="0.2"
            friction={1} // Same reason explained in the Level file
            position={[0, 1, 0]}
        >
            <mesh
                castShadow // We are only casting a shadow and not receiving it for gameplay purposes, so we can still see the ball, even if it looks less realistic
            >
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial
                    flatShading // Flatshading is added so the player can "see" the rotation happening
                    color="mediumpurple"
                />
            </mesh>
        </RigidBody>
    );
};

export default Player;
