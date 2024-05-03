//import './App.css'

import { useMachine } from "@xstate/react";
import { musicMachine } from "./machines/musicMachine";
import { Player } from "./Player";
import { SyncLyric } from "./SyncLyric";

function App() {
  const playerMachine = useMachine(musicMachine);

  return (
    <>
      <div className="grid max-w-xl mx-auto  rounded-md shadow-sm p-4">
        <Player machine={playerMachine} />
        <SyncLyric playerMachine={playerMachine} />
      </div>
    </>
  );
}

export default App;
