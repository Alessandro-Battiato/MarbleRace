import React, { useEffect, useRef, useState } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import useGame from "./stores/useGame";

const Player = () => {
    const [subscribeKeys, getKeys] = useKeyboardControls(); // The 2 destructured functions: subscribeKeys is used to subscribe to key changes (useful to know when the jump key has been pressed), getKeys is a function used to get the current states of the keys (useful to know if the WASD keys are being pressed)
    const { rapier, world } = useRapier();
    const marbleRef = useRef();

    const start = useGame((state) => state.start);

    const [smoothedCameraPosition] = useState(
        () => new THREE.Vector3(10, 10, 10)
    ); // initial values to prevent the camera from spawning from beneath the floor
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

    const jump = () => {
        // All of the following chunk of code solves the issue where the ball can jump infinitely even when mid-air, so we are casting a ray from the ball towards the floor origin and if the distance is too high, the ball won't be able to jump
        const origin = marbleRef.current.translation();
        origin.y -= 0.31;
        const direction = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(origin, direction);
        const hit = world.castRay(ray, 10, true); // 10 is the max distance for the ray while the True parameter fixes the wrong value of the time of impact, because up until now the cast ray considered the origin of the floor "beneath" the actual floor where the ball is currently standing up, because the floor is thick so the origin was considered like at the very bottom, but giving the true parameter, the ray will consider as the floor being "filled" and thus the origin will correctly be considered right underneath the ball, where it's colliding with the floor

        if (hit.timeOfImpact < 0.15) {
            // The higher the value, the higher the distance between the ball and the floor, so the ball should only jump if underneath the specified value
            marbleRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
        }
    };

    useEffect(() => {
        // To listen to the "Jump" event we use the subscribeKeys
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) {
                    // The jump action needs to work immediately when the player presses the spacebar, not when it is released
                    jump();
                }
            }
        );

        const unsubscribeAny = subscribeKeys(() => {
            // Whenever the player presses any arrow key, the game will start
            start();
        });

        return () => {
            // This is a fix for a bug that potentially could never occur in production, but we still fix it for cleaner code
            // In fact, whenever we change something in the code, and we do not reload, the hod module replacement will make the changes occur but, we are going to basically destroy the player and re-subscribe for the jump action, and this will make the player jump twice
            // So we just use this cleanup function to solve the issue
            unsubscribeJump();
            unsubscribeAny();
        };
    }, []);

    useFrame((state, delta) => {
        /**
         * Controls
         */
        const { forward, backward, leftward, rightward } = getKeys();

        // We set 1 impulse and 1 torque with these values because sometimes the player could press 2 buttons while airborne like forward and then right for example and this makes it work right
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        // We use delta (time passed between each frame) in order to make the strength of the controls the same for all of the players, otherwise players with higher framerate would have a "stronger" ball movement
        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        // The controls are thought as to make the player move even if slightly when airborne, as done already in many other games
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

        /**
         * Camera
         */
        const marbleRefPosition = marbleRef.current.translation();

        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(marbleRefPosition);
        cameraPosition.z += 2.25;
        cameraPosition.y += 0.65;

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(marbleRefPosition);
        cameraTarget.y += 0.25; // this way the camera will look slightly above the marble

        // Lerping
        smoothedCameraPosition.lerp(cameraPosition, 5 * delta); // Takes the initial value and each frame it brings it a little closer to the destination
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

        state.camera.position.copy(cameraPosition);
        state.camera.lookAt(cameraTarget);
    });

    return (
        <RigidBody
            ref={marbleRef}
            canSleep={false} // In the latest version of @react-three/rapier and rapier, a RigidBody falls asleep after a few seconds of inaction. This would result in the sphere not moving even though the player presses the arrow keys. The prop can sleep set to false fixes the issue
            colliders="ball"
            restitution="0.2"
            friction={1} // Same reason explained in the Level file
            position={[0, 1, 0]}
            linearDamping={0.5} // the linear and angular damping will make the player able to stop after moving for a while
            angularDamping={0.5}
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
