import { useCallback, useState } from "react";
import { WordDisplay } from "./WordDisplay";
import { useWordState } from "./use-word";

/**
 * ノーツ
 */
type Note = {
  lane: number;
  shift: "upper" | "middle" | "lower";
  step: number;
};

const romanToNoteMap: { [key: string]: Omit<Note, "step"> } = {
  // 中段
  q: { lane: 1, shift: "middle" },
  w: { lane: 2, shift: "middle" },
  e: { lane: 3, shift: "middle" },
  r: { lane: 4, shift: "middle" },
  t: { lane: 5, shift: "middle" },
  y: { lane: 6, shift: "middle" },
  u: { lane: 7, shift: "middle" },
  i: { lane: 8, shift: "middle" },
  o: { lane: 9, shift: "middle" },
  p: { lane: 10, shift: "middle" },
  // 上段
  a: { lane: 1, shift: "upper" },
  s: { lane: 2, shift: "upper" },
  d: { lane: 3, shift: "upper" },
  f: { lane: 4, shift: "upper" },
  g: { lane: 5, shift: "upper" },
  h: { lane: 6, shift: "upper" },
  j: { lane: 7, shift: "upper" },
  k: { lane: 8, shift: "upper" },
  l: { lane: 9, shift: "upper" },
  // 下段
  z: { lane: 1, shift: "lower" },
  x: { lane: 2, shift: "lower" },
  c: { lane: 3, shift: "lower" },
  v: { lane: 4, shift: "lower" },
  b: { lane: 5, shift: "lower" },
  n: { lane: 6, shift: "lower" },
  m: { lane: 7, shift: "lower" },
};

/**
 * ローマ字の文字列を、ノーツに変換する
 */
function convertCharsToNotes(characters: string): Note[] {
  // TODO: 文字列にa~z以外が含まれている場合の処理を書く
  const notes = characters.split("").map((char, index) => ({
    step: index + 1,
    ...romanToNoteMap[char],
  }));
  return notes;
}

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

function shiftNotes(notes: Note[]): Note[] {
  return notes
    .filter((_, index) => index > 0)
    .map((note) => ({ ...note, step: note.step - 1 }));
}

type Shift = "upper" | "middle" | "lower";

/**
 * シフト切り替えのテスト用
 */
function nextShift(shift: Shift): Shift {
  if (shift === "upper") return "middle";
  if (shift === "middle") return "lower";
  return "upper";
}

/**
 * シフトを表す色に変換する
 */
function shiftToColor(shift: Shift): string {
  if (shift === "upper") return "bg-red-500";
  if (shift === "middle") return "bg-yellow-400";
  return "bg-blue-500";
}

/**
 * シフト状態に応じて、キーボードの配列を返す
 */
function shiftToKeyboard(shift: Shift): string {
  if (shift === "upper") return "qwertyuiop";
  if (shift === "middle") return "asdfghjkl;";
  return "zxcvbnm,./";
}

function App() {
  const [notes, setNotes] = useState<Note[]>(
    convertCharsToNotes("yorosikuonegaisimasu")
  );

  const [currentShift, setCurrentShift] = useState<Shift>("middle");
  const { wordState, proceedToNextWord, advanceCursor } = useWordState();

  /** ゲームを開始する */
  const handleGameStart = useCallback(() => {
    // wordStateを初期化する必要がある. wordsの0番目を入れる
    proceedToNextWord();
  }, [proceedToNextWord]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <Board notes={notes} />
        <JudgeLine color={shiftToColor(currentShift)} />

        <div className="my-4">
          {wordState ? (
            <WordDisplay
              word={wordState.currentWord}
              cursor={wordState.cursor}
            />
          ) : (
            <button className="text-center" onClick={() => handleGameStart()}>
              スタート
            </button>
          )}
        </div>

        <KeyboardLine keys={shiftToKeyboard(currentShift)} />

        <button onClick={() => setNotes(shiftNotes(notes))}>
          ノーツを進める
        </button>
        <button onClick={() => advanceCursor()}>
          ワードの入力を1文字進める
        </button>
        <button onClick={() => proceedToNextWord()}>次のワードに進む</button>
        <button onClick={() => setCurrentShift(nextShift(currentShift))}>
          シフトを切り替える
        </button>
      </div>
    </div>
  );
}

export default App;
