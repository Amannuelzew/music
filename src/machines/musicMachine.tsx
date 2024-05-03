import { assign, fromCallback, fromPromise, setup } from "xstate";
import Liricle from "liricle";

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
          line: string;
        }
      | { type: "update"; time: number }
      | { type: "update volume"; volume: number }
      | { type: "sync"; current: number }
      | { type: "update line"; line: string },
  },
  actors: {
    loadMusic: fromPromise(async () => {
      return await load().then((res) => res);
    }),
    updateProgress: fromCallback(({ input, sendBack }) => {
      //update progress,remian,elapsed on update
      input.audioRef.ontimeupdate = (event) => {
        //change state to paused when is audio finsh
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
        //sync lyrics
        sendBack({ type: "sync", current: input.audioRef.currentTime });
      };
    }),
    synchronize: fromCallback(({ input, sendBack }) => {
      input.lrc.on("sync", (line) => {
        sendBack({ type: "update line", line: line.text });
      });
    }),
  },
  actions: {
    volume: ({ context, event }) => {
      context.audioRef.volume = event.volume;
    },
    sync: ({ context }, params) => {
      context.lrc.sync(params.current, false);
    },
  },
}).createMachine({
  initial: "loading",
  context: {
    audioRef: null,
    lrc: new Liricle(),
    remain: "",
    elapsed: "0:00",
    progress: 0,
    duration: 0,
    volume: 0.2,
    line: "",
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
          target: "ready.player",
        },
        onError: {
          target: "error",
        },
      },
    },
    ready: {
      type: "parallel",
      states: {
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
        lyrics: {
          entry: ({ context }) =>
            context.lrc.load({
              text: `[00:28.76]I'm findin' ways to articulate
[00:30.76]The feeling I'm goin' through
[00:33.29]I just can't say I don't love you
[00:38.78]'Cause I love you, yeah
[00:43.29]It's hard for me to communicate the thoughts that I hold
[00:47.05]But tonight I'm gon' let you know
[00:49.77]Let me tell the truth
[00:52.54]Baby let me tell the truth, yeah
[00:56.78]You know what I'm thinkin'
[00:58.54]See it in your eyes
[01:00.52]You hate that you want me
[01:02.27]Hate it when you cry
[01:04.04]You're scared to be lonely
[01:05.78]'Specially in the night
[01:07.52]I'm scared that I'll miss you
[01:09.54]Happens every time
[01:11.04]I don't want this feelin'
[01:12.78]I can't afford love
[01:14.77]I try to find reason to pull us apart
[01:18.27]It ain't workin' 'cause you're perfect
[01:20.03]And I know that you're worth it
[01:22.05]I can't walk away, oh!
[01:25.53]Even though we're going through it
[01:29.28]And it makes you feel alone
[01:31.54]Just know that I would die for you
[01:35.52]Baby I would die for you, yeah
[01:40.05]The distance and the time between us
[01:43.29]It'll never change my mind, 'cause baby
[01:46.79]I would die for you
[01:49.78]Baby I would die for you, yeah
[01:54.51]I'm finding ways to manipulate the feelin' you're goin' through
[01:59.54]But baby girl, I'm not blamin' you
[02:04.79]Just don't blame me too, yeah
[02:09.04]'Cause I can't take this pain forever
[02:12.53]And you won't find no one that's better
[02:15.78]'Cause I'm right for you, babe
[02:18.80]I think I'm right for you, babe
[02:22.80]You know what I'm thinkin'
[02:25.54]See it in your eyes
[02:26.53]You hate that you want me
[02:28.27]Hate it when you cry
[02:30.02]It ain't workin' 'cause you're perfect
[02:31.53]And I know that you're worth it
[02:33.54]I can't walk away, oh!
[02:37.28]Even though we're going through it
[02:40.53]And it makes you feel alone
[02:43.05]Just know that I would die for you
[02:47.04]Baby I would die for you, yeah
[02:51.53]The distance and the time between us
[02:54.79]It'll never change my mind, 'cause baby
[02:58.28]I would die for you
[03:01.54]Baby I would die for you, yeah
[03:06.04]I would die for you
[03:07.76]I would lie for you
[03:09.52]Keep it real with you
[03:11.04]I would kill for you, my baby
[03:16.53]I'm just sayin', yeah
[03:20.27]I would die for you
[03:21.78]I would lie for you
[03:23.53]Keep it real with you
[03:25.53]I would kill for you, my baby
[03:30.53]Na-na-na, na-na-na, na-na-na
[03:34.55]Even though we're going through it
[03:37.78]And it makes you feel alone
[03:40.51]Just know that I would die for you
[03:44.54]Baby I would die for you, yeah
[03:48.79]The distance and the time between us
[03:52.29]It'll never change my mind, 'cause baby
[03:56.02]I would die for you
[03:58.53]Baby I would die for you, yeah babe
[04:03.77]Die for you`,
            }),
          invoke: {
            src: "synchronize",
            input: ({ context }) => ({
              lrc: context.lrc,
            }),
          },
          on: {
            sync: {
              actions: {
                type: "sync",
                params: ({ event }) => ({
                  current: event.current,
                }),
              },
            },
            "update line": {
              actions: assign({
                line: ({ event }) => event.line,
              }),
            },
          },
        },
      },
    },
    error: {},
  },
});
