import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import useGame from "./stores/useGame.js";

export default function Experience() {
    // It's best to only select the props you need to use in the component because each change re-renders the component
    const blocksCount = useGame((state) => state.blocksCount); // callback selector for the blocks count
    const blocksSeed = useGame((state) => state.blocksSeed);

    return (
        <>
            <color args={["#bdedfc"]} attach="background" />

            <Physics>
                <Lights />
                <Level count={blocksCount} seed={blocksSeed} />
                <Player />
            </Physics>
        </>
    );
}
