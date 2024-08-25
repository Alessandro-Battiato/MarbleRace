import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// The subscribeWithSelector makes our store available for subscriptions

export default create(
    subscribeWithSelector((set) => {
        return {
            blocksCount: 3,
            /**
             * Time
             */
            startTime: 0,
            endTime: 0,
            /**
             * Phases
             */
            phase: "ready",
            start: () => {
                set((state) => {
                    // The set function returns the new, updated, state, useful for us so that we can update the phase
                    if (state.phase === "ready") {
                        // We prevent the start method from being spam called whenever the player presses a key
                        return { phase: "playing", startTime: Date.now() };
                    } else {
                        return {};
                    }
                });
            },
            restart: () => {
                set((state) => {
                    if (state.phase === "playing" || state.phase === "ended") {
                        // Whenever the phase changes to ready, this will automatically trigger the reset method defined in the Player file, and if you remember, you're using selectors to gather these values so everything will be automatically re-rendered and thus everything works because the phase changes, React detects the change and the reset method is invoked
                        return { phase: "ready" };
                    } else {
                        return {};
                    }
                });
            },
            end: () => {
                set((state) => {
                    if (state.phase === "playing") {
                        return { phase: "ended", endTime: Date.now() };
                    } else {
                        return {};
                    }
                });
            },
        };
    })
);
