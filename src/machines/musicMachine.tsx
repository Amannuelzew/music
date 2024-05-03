import { assign, fromCallback, fromPromise, setup } from "xstate";

const load = () => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = "./TheWeeknd.mp3";
    audio.preload = "auto";
    audio.volume = 0.2;
    audio.oncanplaythrough = resolve(audio);
    audio.onerror = reject(audio);
  });
};

export const musicMachine = setup({
  types: {
    events: {} as
      | { type: "play" }
      | { type: "pause" }
      | {
          type: "update progress";
          progress: number;
          remain: number;
          elapsed: number;
        }
      | { type: "update"; time: number }
      | { type: "update volume"; volume: number },
  },
  actors: {
    loadMusic: fromPromise(async () => {
      return await load().then((res) => res);
    }),
    updateProgress: fromCallback(({ input, sendBack }) => {
      //update progress,remian,elapsed on update
      input.audioRef.ontimeupdate = (event) => {
        //change state to paused when the audioRef finsh
        if (input.audioRef.duration == input.audioRef.currentTime)
          sendBack({ type: "pause" });
        const r = input.audioRef.duration - input.audioRef.currentTime;
        const e = input.audioRef.currentTime;
        sendBack({
          type: "update progress",
          progress: (event.target.currentTime * 100) / event.target.duration,
          remain: `-${Math.floor(r / 60)}:${
            Math.round(r % 60) < 10 ? "0" : ""
          }${Math.round(r % 60) == 60 ? "59" : Math.round(r % 60)}`,
          elapsed: `${Math.floor(e / 60)}:${
            Math.round(e % 60) < 10 ? "0" : ""
          }${Math.round(e % 60) == 60 ? "59" : Math.round(e % 60)}`,
        });
      };
    }),
  },
  actions: {
    volume: ({ context, event }) => {
      context.audioRef.volume = event.volume;
    },
  },
}).createMachine({
  initial: "loading",
  context: {
    audioRef: null,
    remain: "",
    elapsed: "0:00",
    progress: 0,
    duration: 0,
    volume: 0.2,
  },
  states: {
    loading: {
      invoke: {
        src: "loadMusic",
        onDone: {
          actions: assign({
            audioRef: ({ event }) => event.output,
            duration: ({ event }) => event.output!.duration,
            remain: ({ event }) =>
              `-${Math.floor(event.output!.duration / 60)}:${Math.round(
                event.output!.duration % 60
              )}`,
          }),
          target: "player",
        },
        onError: {
          target: "error",
        },
      },
    },
    player: {
      initial: "paused",
      states: {
        playing: {
          invoke: {
            src: "updateProgress",
            input: ({ context }) => ({
              audioRef: context.audioRef,
            }),
          },
          on: {
            pause: {
              target: "paused",
            },
          },
        },
        paused: {
          invoke: {
            src: "updateProgress",
            input: ({ context }) => ({
              audioRef: context.audioRef,
            }),
          },
          entry: ({ context }) => context.audioRef.pause(),
          exit: ({ context }) => context.audioRef.play(),
          on: {
            play: {
              target: "playing",
            },
          },
        },
      },
      on: {
        "update progress": {
          actions: assign({
            progress: ({ event }) => event.progress,
            remain: ({ event }) => event.remain,
            elapsed: ({ event }) => event.elapsed,
          }),
        },
        update: {
          actions: ({ context, event }) =>
            (context.audioRef.currentTime = event.time),
        },
        "update volume": {
          actions: [
            assign({
              volume: ({ event }) => event.volume,
            }),
            {
              type: "volume",
            },
          ],
        },
      },
    },
    error: {},
  },
});
