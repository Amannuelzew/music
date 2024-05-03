//import './App.css'

import { useMachine } from "@xstate/react";
import { musicMachine } from "./machines/musicMachine";
import { lrcMachine } from "./machines/lrcMachine";
import { Player } from "./Player";
import { Lrc } from "./Lrc";
import { SyncLyric } from "./SyncLyric";

function App() {
  const playerMachine = useMachine(musicMachine);
  const lrc = useMachine(lrcMachine);

  return (
    <>
      <div className="grid max-w-xl mx-auto rounded-md shadow-sm p-4">
        <Player machine={playerMachine} lrcMachine={lrc} />
        {/* <SyncLyric playerMachine={playerMachine} /> */}
        <Lrc machine={playerMachine} />
      </div>
    </>
  );
}

export default App;
