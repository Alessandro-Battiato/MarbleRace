import React, { useMemo, useRef, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategray" });

export const BlockStart = ({ position = [0, 0, 0] }) => {
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

export const BlockEnd = ({ position = [0, 0, 0] }) => {
    const hamburger = useGLTF("./hamburger.glb");

    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true; // so each part of the hamburger casts a shadow
    });

    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, 0, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
            <RigidBody
                type="fixed"
                colliders="hull"
                position={[0, 0.25, 0]}
                restitution={0.2}
                friction={0}
            >
                <primitive object={hamburger.scene} scale={0.2} />
            </RigidBody>
        </group>
    );
};

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
    const obstacleRef = useRef(null);
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
    ); // 0.2 is a threshold to not make the obstacles slower than 0.2, while the second part of Math.random is done to give a 50% chance of rotating in the opposite way

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0)); // we multiply the time by the speed to give obstacles more randomness when they spin otherwise they would spin at the same speed
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

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
    const obstacleRef = useRef(null);
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2); // 0.2 is a threshold to not make the obstacles slower than 0.2, while the second part of Math.random is done to give a 50% chance of rotating in the opposite way

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const y = Math.sin(time + timeOffset) + 1.15; // 1.15 puts the obstacle above the floor
        obstacleRef.current.setNextKinematicTranslation({
            // you are using the position like this because otherwise those would be absolute values
            x: position[0],
            y: position[1] + y,
            z: position[2],
        });
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

export const BlockAxe = ({ position = [0, 0, 0] }) => {
    const obstacleRef = useRef(null);
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const x = Math.sin(time + timeOffset) * 1.25;
        obstacleRef.current.setNextKinematicTranslation({
            x: position[0] + x,
            y: position[1] + 0.75,
            z: position[2],
        });
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
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
};

export const Bounds = ({ length = 1 }) => {
    // We only need 1 rigid body because by default R3F creates 3 cuboid colliders for each mesh and it's ok
    return (
        <RigidBody restitution={0.2} friction={0} type="fixed">
            {/* Right wall */}
            <mesh
                position={[2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                castShadow
            />
            {/* Left wall */}
            <mesh
                position={[-2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                receiveShadow // this doesn't need to cast shadows because of the light source
            />
            {/* End level wall */}
            <mesh
                position={[0, 0.75, -(length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow
            />
        </RigidBody>
    );
};

export const Level = ({
    count = 5,
    types = [BlockSpinner, BlockAxe, BlockLimbo],
}) => {
    const blocks = useMemo(() => {
        const blocks = [];

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]; // Math.floor to get a value between 0 and the number of the types
            blocks.push(type);
        }

        return blocks;
    }, [count, types]);

    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            {blocks.map((Block, i) => (
                <Block key={i} position={[0, 0, -(i + 1) * 4]} />
            ))}
            <BlockEnd position={[0, 0, -(count + 1) * 4]} />
            <Bounds length={count + 2} />
        </>
    );
};
