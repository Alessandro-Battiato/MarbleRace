import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategray" });

const BlockStart = ({ position = [0, 0, 0] }) => {
    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
        </group>
    );
};

const BlockSpinner = ({ position = [0, 0, 0] }) => {
    const obstacleRef = useRef(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time, 0));
        obstacleRef.current.setNextKinematicRotation(rotation);
    });

    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            {/* Obstacle */}
            <RigidBody
                ref={obstacleRef}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0} // we set 0 so that the ball just needs to slightly bounce, the player does not have to get stuck
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
};

const Level = () => {
    return (
        <>
            <BlockStart position={[0, 0, 4]} />
            <BlockSpinner position={[0, 0, 0]} />
        </>
    );
};

export default Level;
