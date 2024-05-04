import { useRef } from "react";
import { ScrollArea } from "./components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const Lrc = ({ machine }) => {
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
  const lines = lyric.split("\n");
  const [current] = machine;
  const parentRef = useRef(null);
  const ref = useRef([]);
  if (current.matches("ready.player")) {
    /* if (current.context.line !== "" && parentRef.current)
      parentRef.current!.children[1]!.scrollTop =
        ref.current[current.context.line.index]!.offsetTop -
        ref.current[current.context.line.index]!.parentNode.offsetTop -
        40; */
    //console.log(parentRef.current!.children[1], "ss");
    if (current.context.line !== "" && parentRef.current)
      ref.current[current.context.line.index]!.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "nearest",
      });
  }
  return (
    <>
      <Tabs defaultValue="line" className="w-4/5 mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="line">Line</TabsTrigger>
          <TabsTrigger value="scroll">Scroll</TabsTrigger>
        </TabsList>
        <TabsContent value="line">
          <p className="text-lg text-center font-semibold">
            {current.context.line.text !== undefined
              ? current.context.line.text
              : "...."}
          </p>
        </TabsContent>
        <TabsContent value="scroll">
          <>
            <ScrollArea
              ref={parentRef}
              className="items-start h-[200px] w-full text-center rounded-md border p-4"
            >
              <div className="p-1">
                {lines.map((line, index) => (
                  <p
                    ref={(el) => (ref.current[index] = el)}
                    className={
                      "p-1 text-base " +
                      (current.context.line.index == index
                        ? "bg-purple-800 rounded-md text-white text-lg font-semibold"
                        : "")
                    }
                    key={index}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </>
        </TabsContent>
      </Tabs>
    </>
  );
};
