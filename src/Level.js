import React from "react";

const BlockStart = ({ position = [0, 0, 0] }) => {
    return (
        <group position={position}>
            <mesh position={[0, -0.1, 0]} receiveShadow>
                <boxGeometry args={[4, 0.2, 4]} />
                <meshStandardMaterial color="limegreen" />
            </mesh>
        </group>
    );
};

const Level = () => {
    return (
        <>
            <BlockStart position={[0, 0, 0]} />
        </>
    );
};

export default Level;
