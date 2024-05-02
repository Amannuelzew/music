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

export const machine = setup({
  types: {
    events: {} as { type: "play" } | { type: "pause" },
  },
  actors: {
    loadMusic: fromPromise(async () => {
      return load().then((res) => res);
    }),
  },
}).createMachine({
  initial: "loading",
  context: {
    audio: null,
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
          on: {
            pause: {
              target: "paused",
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
