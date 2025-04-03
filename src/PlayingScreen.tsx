import { useEffect, useState } from "react";
import { Note, Word } from "./core";
import { WordDisplay } from "./WordDisplay";
import { convertCharsToNotes, shiftNotes } from "./use-notes";

/**
 * 譜面
 */
const Board = ({ notes }: { notes: Note[] }) => {
  return (
    <div className="flex w-xl h-[600px] border overflow-hidden">
      {[...Array(10)].map((_, laneIndex) => (
        <div
          key={laneIndex}
          className={`flex-1 relative border-gray-800 ${
            laneIndex === 0 ? "" : "border-l"
          }`}
        >
          {notes
            .filter((n) => n.lane === laneIndex + 1)
            .map((note) => (
              <div
                key={note.step}
                className={`absolute left-1/2 transform -translate-x-1/2 w-full h-5 rounded text-sm flex items-center justify-center
                    ${note.shift === "upper" ? "bg-red-500" : ""}
                    ${note.shift === "middle" ? "bg-yellow-400" : ""}
                    ${note.shift === "lower" ? "bg-blue-500" : ""}
                `}
                style={{
                  bottom: `${note.step * 50}px`,
                }}
              ></div>
            ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 判定ライン
 */
const JudgeLine = ({ color }: { color: string }) => {
  return <div className={`h-4 ${color} transition-colors duration-100`} />;
};

/**
 * キーボードの表示
 */
const KeyboardLine = ({ keys }: { keys: string }) => {
  return (
    <div className="flex gap-1">
      {keys.split("").map((key, index) => (
        <div
          key={index}
          className="flex-1 h-12 rounded bg-gray-200 text-lg font-medium border flex justify-center items-center"
        >
          {key}
        </div>
      ))}
    </div>
  );
};

type Shift = "upper" | "middle" | "lower";

/**
 * シフトを表す色に変換する
 */
function shiftToColor(shift: Shift): string {
  if (shift === "upper") return "bg-red-500";
  if (shift === "middle") return "bg-yellow-400";
  return "bg-blue-500";
}

function shiftToKeyboard(shift: Shift): string {
  if (shift === "upper") return "qwertyuiop";
  if (shift === "middle") return "asdfghjkl;";
  return "zxcvbnm,./";
}

type WordState = {
  currentWord: Word;
  cursor: number;
};

/**
 * 文字が入力されたときに発火するイベント
 */
type CharacterInputEvent = {
  key: string;
  time: number;
};

type PlayingScreenProps = {
  word: Word;
  characterInputEvent: CharacterInputEvent | undefined;
};

/**
 * プレイ画面
 */
export const PlayingScreen = ({
  word,
  characterInputEvent,
}: PlayingScreenProps) => {
  const [notes, setNotes] = useState<Note[]>(
    convertCharsToNotes(word.characters)
  );

  const [wordState, setWordState] = useState<WordState>({
    currentWord: word,
    cursor: 0,
  });

  // 文字が入力されたときの処理
  useEffect(() => {
    console.log("文字が入力されました", characterInputEvent);

    // とりあえず、何を押しても正解にしてみる
    // カーソルを進める
    setWordState((wordState) => {
      const newCursor = wordState.cursor + 1;
      if (newCursor === wordState.currentWord.characters.length) {
        // TODO: 最後まで到達していたら、次のワードへ
        console.log("次のワードに進みます");
      }
      return { ...wordState, cursor: newCursor };
    });

    // ノーツを更新する
    setNotes((notes) => {
      return shiftNotes(notes);
    });

    // if (wordState.cursor === wordState.currentWord.characters.length) {
    //   // 最後まで到達したら次のワードへ
    // }
  }, [characterInputEvent]);

  return (
    <>
      <Board notes={notes} />
      <JudgeLine color={shiftToColor("middle")} />
      <WordDisplay word={wordState.currentWord} cursor={wordState.cursor} />
      <KeyboardLine keys={shiftToKeyboard("middle")} />
    </>
  );
};
