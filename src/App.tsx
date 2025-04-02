import { useCallback, useState } from "react";
import { WordDisplay } from "./WordDisplay";
import { useWordState } from "./use-word";
import { Note, Word } from "./core";
import { useNotes } from "./use-notes";

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

const words: Word[] = [
  { display: "よろしくお願いします", characters: "yorosikuonegaisimasu" },
  { display: "あいうえお", characters: "aiueo" },
  { display: "かきくけこ", characters: "kakikukeko" },
  { display: "こんにちは", characters: "konnnitiha" },
];

function App() {
  const [currentShift, setCurrentShift] = useState<Shift>("middle");
  const { wordState, setNewWord, advanceCursor } = useWordState();
  const { notes, setNewNotes, shiftNotes } = useNotes();

  /** ゲームを開始する */
  const handleGameStart = useCallback(() => {
    // wordStateを初期化する必要がある. wordsの0番目を入れる
    const initialWord = words[0];
    if (initialWord !== undefined) {
      setNewWord(initialWord);
      setNewNotes(initialWord.characters);
    }
  }, [setNewWord, setNewNotes]);

  /** キーボード入力を処理する */
  const handleKeyboardInput = useCallback(() => {
    // 正しいキーが入力されたと仮定する

    // 譜面のノーツと、ワードのカーソルを更新する
    shiftNotes();
    advanceCursor();
  }, [shiftNotes, advanceCursor]);

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

        <button onClick={() => shiftNotes()}>ノーツを進める</button>
        <button onClick={() => handleKeyboardInput()}>
          ワードの入力を1文字進める
        </button>
        {/* <button onClick={() => proceedToNextWord()}>次のワードに進む</button> */}
        <button onClick={() => setCurrentShift(nextShift(currentShift))}>
          シフトを切り替える
        </button>
      </div>
    </div>
  );
}

export default App;
