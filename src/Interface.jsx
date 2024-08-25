import React, { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { addEffect } from "@react-three/fiber";

const Interface = () => {
    const timeRef = useRef(null);
    const restart = useGame((state) => state.restart);
    const phase = useGame((state) => state.phase);

    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const jump = useKeyboardControls((state) => state.jump);

    useEffect(() => {
        // Basically, considering the Interface component is not inside the Canvas component so we are outside of R3F's context
        // We are not able to use the useFrame, we could use requestAnimationFrame with native js to operate in each frame
        // But the official solution is to use the addEffect provided to us by R3F!
        const unsubscribeEffect = addEffect(() => {
            // Only in this particular context we are retrieving the store state using the getState method, because otherwise
            // We would be using the "old" version of the state in the store, so each frame for example we would see the phase value equal to "ready" even if the player moves
            const state = useGame.getState();

            let elapsedTime = 0;

            if (state.phase === "playing") {
                // Immediately when the player starts to play
                elapsedTime = Date.now() - state.startTime;
            } else if (state.phase === "ended") {
                elapsedTime = state.endTime - state.startTime;
            }

            elapsedTime /= 1000;
            elapsedTime = elapsedTime.toFixed(2); // only 2 decimal numbers

            if (timeRef.current) {
                timeRef.current.textContent = elapsedTime;
            }
        });

        return () => {
            // Even this one needs to be cleaned up otherwise, for the same reason explained in the Player file
            unsubscribeEffect();
        };
    }, []);

    return (
        <div className="interface">
            {/* Time */}
            <div ref={timeRef} className="time">
                0.00
            </div>
            {/* Restart */}
            {phase === "ended" && (
                <div onClick={restart} className="restart">
                    Restart
                </div>
            )}
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
