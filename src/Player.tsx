import { Button } from "./components/ui/button";
import { LoaderIcon, PauseIcon, PlayIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
export const Player = ({ machine }) => {
  const [state, send] = machine;
  window.audioRef = state.context.audioRef;
  return (
    <>
      <h1>{JSON.stringify(state.value)}</h1>
      <div className="space-y-2 mb-1">
        {state.matches("ready.player") && (
          <>
            <div className="flex gap-4 items-center space-y-2">
              <p>{state.context.elapsed}</p>
              <Slider
                defaultValue={[0]}
                onValueChange={(event) => {
                  send({ type: "update", time: event[0] });
                }}
                value={[state.context.audioRef.currentTime]}
                max={258.77}
                className="w-[60%]"
              />
              <p>{state.context.remain}</p>
            </div>
            <Slider
              defaultValue={[0.2]}
              onValueChange={(event) => {
                send({ type: "update volume", volume: event[0] });
              }}
              value={[state.context.volume]}
              step={0.1}
              max={1}
              className="w-[60%]"
            />
          </>
        )}
        {state.matches("loading") ? (
          <Button onClick={() => {}} variant="outline" size="icon">
            <LoaderIcon />
          </Button>
        ) : state.matches("ready.player.paused") ? (
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
      </div>
    </>
  );
};
