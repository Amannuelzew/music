import { assign, setup } from "xstate";

const lyric = `I'm findin' ways to articulate
The feeling I'm goin' through
I just can't say I don't love you
'Cause I love you, yeah`;
const list = lyric.split("\n");
let lrc = {};
for (let index = 0; index < list.length; index++) {
  lrc[index] = list[index];
}
export const machine = setup({
  types: {
    events: {} as
      | { type: "down"; time: number }
      | { type: "up" }
      | { type: "move"; line: number },
  },
  actions: {
    mark: ({ context, event }) => {
      context.lyrics[context.line] = event.time.toFixed(2);
    },
  },
}).createMachine({
  initial: "idle",
  context: {
    line: -1,
    current: 0,
    lyrics: {},
  },
  states: {
    idle: {},
    move: {
      entry: assign({
        line: ({ event }) => event.line,
      }),
      always: "idle",
    },
    "move down": {
      entry: assign({
        line: ({ context }) => (context.line += 1),
      }),
      always: "mark",
    },
    mark: {
      entry: {
        type: "mark",
      },
      always: "idle",
    },
    "move up": {
      entry: ({ context }) => {
        delete context.lyrics[context.line];
      },
      exit: assign({
        line: ({ context }) => (context.line -= 1),
      }),
      always: "idle",
    },
  },
  on: {
    down: {
      guard: ({ context }) => context.line <= 71,
      target: ".move down",
    },
    up: {
      guard: ({ context }) => context.line >= 0,
      target: ".move up",
    },
    move: {
      target: ".move",
    },
  },
});
