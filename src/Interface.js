import { useKeyboardControls } from "@react-three/drei";
import React from "react";

const Interface = () => {
    const { forward, backward, leftward, rightward, jump } =
        useKeyboardControls((state) => state); // controls selector

    return (
        <div className="interface">
            {/* Time */}
            <div className="time">0.00</div>
            {/* Restart */}
            <div className="restart">Restart</div>
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
