import { useMemo } from "react";
import { Note, Word } from "./core";
import { WordDisplay } from "./WordDisplay";

/**
 * 譜面
 */
const Board = ({ notes }: { notes: Note[] }) => {
  return (
    <div className="flex w-xl h-[600px] border border-gray-300 overflow-hidden bg-white rounded-md">
      {[...Array(10)].map((_, laneIndex) => (
        <div
          key={laneIndex}
          className={`flex-1 relative border-gray-300 ${
            laneIndex === 0 ? "" : "border-l"
          }`}
        >
          {notes
            .filter((n) => n.lane === laneIndex + 1)
            .map((note) => (
              <div
                key={note.step}
                className={`absolute left-1/2 transform -translate-x-1/2 w-full h-5 rounded text-sm flex items-center justify-center
                    ${note.shift === "upper" ? "bg-red-400" : ""}
                    ${note.shift === "middle" ? "bg-yellow-300" : ""}
                    ${note.shift === "lower" ? "bg-blue-300" : ""}
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
  return <div className={`h-4 rounded-md ${color}`} />;
};

/**
 * キーボードの表示
 */
const KeyboardLine = ({ keys, nextKey }: { keys: string; nextKey: string }) => {
  return (
    <div className="flex gap-1">
      {keys.split("").map((key, index) =>
        key === nextKey ? (
          <div className="flex-1 h-12 rounded text-lg font-medium bg-white border-2 border-orange-500 text-orange-500 font-mono flex justify-center items-center">
            {key}
          </div>
        ) : (
          <div
            key={index}
            className="flex-1 h-12 rounded bg-white text-lg font-medium border border-gray-300 hover:bg-gray-100 flex justify-center items-center font-mono"
          >
            {key}
          </div>
        )
      )}
    </div>
  );
};

type Shift = "upper" | "middle" | "lower";

/**
 * シフトを表す色に変換する
 */
function shiftToColor(shift: Shift): string {
  if (shift === "upper") return "bg-red-400";
  if (shift === "middle") return "bg-yellow-300";
  return "bg-blue-300";
}

function shiftToKeyboard(shift: Shift): string {
  if (shift === "upper") return "qwertyuiop";
  if (shift === "middle") return "asdfghjkl;";
  return "zxcvbnm,./";
}

type Layer = Shift;

type PlayingScreenProps = {
  currentWord: Word;
  cursor: number;
  notes: Note[];
  layer: Layer;
};

/**
 * プレイ画面
 */
export const PlayingScreen = ({
  currentWord,
  cursor,
  notes,
  layer,
}: PlayingScreenProps) => {
  const nextKey = useMemo(() => {
    if (cursor >= currentWord.characters.length) return "";
    return currentWord.characters[cursor];
  }, [currentWord, cursor]);

  return (
    <>
      <div className="bg-gray-100 px-4 py-4 min-h-screen">
        <Board notes={notes} />
        <JudgeLine color={shiftToColor(layer)} />
        <div className="my-4">
          <WordDisplay word={currentWord} cursor={cursor} />
        </div>
        <KeyboardLine keys={shiftToKeyboard(layer)} nextKey={nextKey} />
      </div>
    </>
  );
};
