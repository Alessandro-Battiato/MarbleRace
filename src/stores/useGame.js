import { create } from "zustand";

export default create((set) => {
    return {
        blocksCount: 3,
        /**
         * Phases
         */
        phase: "ready",
        start: () => {
            set(() => {
                // The set function returns the new, updated, state, useful for us so that we can update the phase
                return { phase: "playing" };
            });
        },
        restart: () => {
            set(() => {
                return { phase: "ready" };
            });
        },
        end: () => {
            set(() => {
                return { phase: "ended" };
            });
        },
    };
});
