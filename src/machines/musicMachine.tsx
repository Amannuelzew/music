import { assign, fromCallback, fromPromise, setup } from "xstate";

const load = () => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = "./TheWeeknd.mp3";
    audio.preload = "auto";
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
      | { type: "update"; time: number },
  },
  actors: {
    loadMusic: fromPromise(async () => {
      return load().then((res) => res);
    }),
    updateProgress: fromCallback(({ input, sendBack }) => {
      input.audio.ontimeupdate = (event) => {
        let r = input.audio.duration - input.audio.currentTime;
        let e = input.audio.currentTime;
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
}).createMachine({
  initial: "loading",
  context: {
    audio: null,
    remain: 0,
    elapsed: 0,
    progress: 0,
  },
  states: {
    loading: {
      invoke: {
        src: "loadMusic",
        onDone: {
          actions: assign({
            audio: ({ event }) => event.output,
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
              audio: context.audio,
            }),
          },
          on: {
            pause: {
              target: "paused",
            },
            "update progress": {
              actions: assign({
                progress: ({ event }) => event.progress,
                remain: ({ event }) => event.remain,
                elapsed: ({ event }) => event.elapsed,
              }),
            },
            update: {
              actions: ({ context, event }) =>
                (context.audio.currentTime = event.time),
            },
          },
        },
        paused: {
          entry: ({ context }) => context.audio.pause(),
          exit: ({ context }) => context.audio.play(),
          on: {
            play: {
              target: "playing",
            },
          },
        },
      },
    },
    error: {},
  },
});
