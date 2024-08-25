import React from "react";
import { RigidBody } from "@react-three/rapier";

const Player = () => {
    // We are only casting a shadow and not receiving it for gameplay purposes, so we can still see the ball, even if it looks less realistic
    // Flatshading is added so the player can "see" the rotation happening
    return (
        <RigidBody
            canSleep={false} // In the latest version of @react-three/rapier and rapier, a RigidBody falls asleep after a few seconds of inaction. This would result in the sphere not moving even though the player presses the arrow keys. The prop can sleep set to false fixes the issue
            colliders="ball"
            restitution="0.2"
            friction={1} // Same reason explained in the Level file
            position={[0, 1, 0]}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    );
};

export default Player;
