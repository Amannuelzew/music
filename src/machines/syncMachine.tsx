import { assign, setup } from "xstate";

const lyric = `...
I'm findin' ways to articulate
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
      | { type: "move down"; time: number }
      | { type: "move up"; time: number },
  },
  actions: {
    mark: ({ context, event }) => {
      context.lyrics[context.line] = event.time;
      console.log(context.lyrics);
    },
  },
}).createMachine({
  initial: "idle",
  context: {
    line: 0,
    current: 0,
    lyrics: {},
  },
  states: {
    idle: {},
    "move down": {
      entry: assign({
        line: ({ context }) => (context.line += 1),
      }),
      target: "idle",
    },
    mark: {
      entry: {
        type: "mark",
      },
      target: "idle",
    },
    "move up": {
      entry: assign({
        line: ({ context }) => (context.line -= 1),
      }),
      target: "mark",
    },
  },
  on: {
    "move down": {
      guard: ({ context }) => context.line <= 71,
      target: ".move down",
    },
    "move up": {
      guard: ({ context }) => context.line >= 1,
      target: ".move up",
    },
  },
});
