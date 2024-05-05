import { assign, emit, setup } from "xstate";

const lyric = `I'm findin' ways to articulate
The feeling I'm goin' through
I just can't say I don't love you
'Cause I love you, yeah 
It's hard for me to communicate the thoughts that I hold
But tonight I'm gon' let you know
Let me tell the truth
Baby let me tell the truth, yeah
You know what I'm thinkin'
See it in your eyes
You hate that you want me
Hate it when you cry
You're scared to be lonely
'Specially in the night
I'm scared that I'll miss you
Happens every time
I don't want this feelin'
I can't afford love
I try to find reason to pull us apart
It ain't workin' 'cause you're perfect
And I know that you're worth it
I can't walk away, oh!
Even though we're going through it
And it makes you feel alone
Just know that I would die for you
Baby I would die for you, yeah
The distance and the time between us
It'll never change my mind, 'cause baby
I would die for you
Baby I would die for you, yeah
I'm finding ways to manipulate 
The feelin' you're goin' through But baby girl, I'm not blamin' you
Just don't blame me too, yeah
'Cause I can't take this pain forever
And you won't find no one that's better
'Cause I'm right for you, babe
I think I'm right for you, babe
You know what I'm thinkin'
See it in your eyes
You hate that you want me
Hate it when you cry
It ain't workin' 'cause you're perfect
And I know that you're worth it
I can't walk away, oh!
Even though we're going through it
And it makes you feel alone
Just know that I would die for you
Baby I would die for you, yeah
The distance and the time between us
It'll never change my mind, 'cause baby
I would die for you
Baby I would die for you, yeah
I would die for you
I would lie for you
Keep it real with you
I would kill for you, my baby
I'm just sayin', yeah
I would die for you
I would lie for you
Keep it real with you
I would kill for you, my baby
Na-na-na, na-na-na, na-na-na
Even though we're going through it
And it makes you feel alone
Just know that I would die for you
Baby I would die for you, yeah
The distance and the time between us
It'll never change my mind, 'cause baby
I would die for you
Baby I would die for you, yeah babe
Die for you`;
const list = lyric.split("\n");
let lrc = {};
for (let index = 0; index < list.length; index++) {
  lrc[index] = list[index];
}
const header = `[ar:Lyrics artist]
[al:Album where the song is from]
[ti:Lyrics (song) title]
[au:Creator of the Songtext]
[length:How long the song is]
[by:Creator of the LRC file]
[re:The player or editor that created the LRC file]
[ve:version of program]`;
const convert = (time: string): string => {
  const t = parseFloat(time);
  return `${Math.floor(t / 60) < 10 ? 0 : ""}${Math.floor(t / 60)}:${(
    t % 60
  ).toFixed(2)}`;
};
export const machine = setup({
  types: {
    events: {} as
      | { type: "down"; time: number }
      | { type: "up" }
      | { type: "move"; line: number }
      | { type: "submit" },
  },
  actions: {
    mark: ({ context, event }) => {
      context.timestamp.push(event.time.toFixed(2));
    },
    submit: ({ context }) => {
      //check(validate) the lyric synchronization
      //change its format to lrc
      //[00:28.76]I'm findin' ways to articulate
      //{"0":"1.30"}
      console.log(header);
      for (let index = 0; index < context.timestamp.length; index++) {
        console.log(`[${convert(context.timestamp[index])}]${list[index]}`);
      }
    },
  },
}).createMachine({
  initial: "idle",
  context: {
    line: -1,
    current: 0,
    timestamp: [],
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
    "move up": {
      entry: ({ context }) => {
        context.timestamp.pop();
      },
      exit: assign({
        line: ({ context }) => (context.line -= 1),
      }),
      always: "idle",
    },
    mark: {
      entry: {
        type: "mark",
      },
      always: "idle",
    },
    submit: {
      entry: "submit",
      exit: emit({ type: "notify", message: "submitted" }),
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
    submit: {
      //guard: ({ context }) => context.line >= 0,
      target: ".submit",
    },
  },
});
