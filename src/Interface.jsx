import React from "react";
import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";

const Interface = () => {
    const restart = useGame((state) => state.restart);
    const phase = useGame((state) => state.phase);

    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const jump = useKeyboardControls((state) => state.jump);

    return (
        <div className="interface">
            {/* Time */}
            <div className="time">0.00</div>
            {/* Restart */}
            {phase === "ended" ? (
                <div onClick={restart} className="restart">
                    Restart
                </div>
            ) : null}
            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? "active" : ""}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? "active" : ""}`}></div>
                    <div className={`key ${backward ? "active" : ""}`}></div>
                    <div className={`key ${rightward ? "active" : ""}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${jump ? "active" : ""} large`}></div>
                </div>
            </div>
        </div>
    );
};

export default Interface;
