import { useMachine } from "@xstate/react";
import { machine } from "./machines/musicMachine";
import { Button } from "./components/ui/button";
import { LoaderIcon, PauseIcon, PlayIcon } from "lucide-react";

export const Player = () => {
  const [state, send] = useMachine(machine);
  return (
    <>
      <div className="flex">
        <h1>{JSON.stringify(state.value)}</h1>
        <p>{state.context.elapsed}</p>
        {state.matches("loading") ? (
          <Button onClick={() => {}} variant="outline" size="icon">
            <LoaderIcon />
          </Button>
        ) : state.matches("player.paused") ? (
          <Button
            onClick={() => {
              send({ type: "play" });
            }}
            variant="outline"
            size="icon"
          >
            <PlayIcon />
          </Button>
        ) : (
          <Button
            onClick={() => {
              send({ type: "pause" });
            }}
            variant="outline"
            size="icon"
          >
            <PauseIcon />
          </Button>
        )}
        <p>{state.context.remain}</p>
      </div>
    </>
  );
};
