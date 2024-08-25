import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// The subscribeWithSelector makes our store available for subscriptions

export default create(
    subscribeWithSelector((set) => {
        return {
            blocksCount: 3,
            /**
             * Phases
             */
            phase: "ready",
            start: () => {
                set((state) => {
                    // The set function returns the new, updated, state, useful for us so that we can update the phase
                    if (state.phase === "ready") {
                        // We prevent the start method from being spam called whenever the player presses a key
                        return { phase: "playing" };
                    } else {
                        return {};
                    }
                });
            },
            restart: () => {
                set((state) => {
                    if (state.phase === "playing" || state.phase === "ended") {
                        return { phase: "ready" };
                    } else {
                        return {};
                    }
                });
            },
            end: () => {
                set((state) => {
                    if (state.phase === "playing") {
                        return { phase: "ended" };
                    } else {
                        return {};
                    }
                });
            },
        };
    })
);
