//import './App.css'

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { useMachine } from "@xstate/react";
import { machine } from "./machines/syncMachine";
import { musicMachine } from "./machines/musicMachine";
import { useRef } from "react";
import { Player } from "./Player";

function App() {
  const lyric = `I'm findin' ways to articulate
The feeling I'm goin' through
I just can't say I don't love you
'Cause I love you, yeah
It's hard for me to communicate 
The thoughts that I hold
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
The feelin' you're goin' through
But baby girl, I'm not blamin' you
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
  const lines = lyric.split("\n");
  const [state, send] = useMachine(machine);
  const playerMachine = useMachine(musicMachine);
  const [current, playerSend] = playerMachine;
  const ref = useRef(null);
  const scroll = (type: number) => {
    ref.current!.children[1]!.scrollTop += 40 * type;
  };
  return (
    <>
      <div className="grid max-w-xl mx-auto  rounded-md shadow-sm p-4">
        <h1 className="text-2xl">
          {JSON.stringify(state.value)}
          {state.context.line}
        </h1>
        <Player machine={playerMachine} />

        <ScrollArea
          ref={ref}
          className="items-start h-[300px] w-[550px] rounded-md border p-4"
        >
          {/* prettier-ignore */}
          <>
          <div className="flex justify-between mb-2 items-baseline p-1" >
           <p className="cursor-pointer" onClick={()=>{
            if(current.matches("player.playing"))
              playerSend({
                type: "update",
                time: 0.00,
              });
           }}>...</p>
           <span className="border rounded-md w-14 text-center ">0:00</span>
          </div>
            {lines.map((line,index)=>(
              index==state.context.line ?
              <div className="flex justify-between mb-2 items-baseline p-1 bg-purple-500 rounded-sm" key={index}>
                <p  >{line}</p>
                <span className="border rounded-md w-14 text-center ">
                  {state.context.lyrics[index]}</span>
              </div>:
               <div className="flex justify-between mb-2 p-1 items-baseline" key={index}>
                <p className="cursor-pointer" onClick={()=>{
                  if (state.context.lyrics[state.context.line] !== undefined){
                        playerSend({
                          type: "update",
                          time: state.context.lyrics[index],
                        })
                        send({type:"move",line:index})
                  }
                      }
                } >{line}</p>
                <span  className="border rounded-md w-14 text-center"> 
                {state.context.lyrics[index]}</span>
              </div>
            ) ) }
            {}
         
          </>
        </ScrollArea>
        <div className="flex gap-4 my-4">
          <Button
            disabled={!current.matches("player.playing")}
            onClick={() => {
              send({
                type: "up",
              });
              scroll(-1);
              if (
                state.context.line > 0 &&
                state.context.lyrics[state.context.line] !== undefined
              )
                playerSend({
                  type: "update",
                  time: state.context.lyrics[state.context.line - 1],
                });
            }}
            variant="outline"
            size="icon"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            disabled={!current.matches("player.playing")}
            onClick={() => {
              send({
                type: "down",
                time: current.context.audio.currentTime,
              });
              scroll(1);
            }}
            variant="outline"
            size="icon"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
