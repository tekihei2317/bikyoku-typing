import { useState } from "react";

/**
 * ノーツ
 */
type Note = {
  lane: number;
  shift: "upper" | "middle" | "lower";
  step: number;
};

/**
 * ワード
 */
type Word = {
  display: string;
  characters: string;
};

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
              >
                {note.step}
              </div>
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
 * ワードを表示する
 */
const WordDisplay = ({ word, cursor }: { word: Word; cursor: number }) => {
  return (
    <div className="text-center my-4">
      <div className="text-3xl font-semibold">{word.display}</div>
      <div className="text-2xl tracking-wider mt-1">
        {word.characters.split("").map((char, index) => (
          <span key={index} className={index < cursor ? "invisible" : ""}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
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

const words: Word[] = [
  { display: "あいうえお", characters: "aiueo" },
  { display: "かきくけこ", characters: "kakikukeko" },
  { display: "こんにちは", characters: "konnnitiha" },
  { display: "よろしくお願いします", characters: "yorosikuonegaisimasu" },
];

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
  const [notes, setNotes] = useState<Note[]>([
    { lane: 6, shift: "upper", step: 1 },
    { lane: 8, shift: "upper", step: 2 },
    { lane: 4, shift: "upper", step: 3 },
    { lane: 9, shift: "upper", step: 4 },
    { lane: 2, shift: "middle", step: 5 },
    { lane: 8, shift: "upper", step: 6 },
    { lane: 8, shift: "middle", step: 7 },
    { lane: 7, shift: "upper", step: 8 },
    { lane: 9, shift: "upper", step: 9 },
    { lane: 6, shift: "lower", step: 10 },
    { lane: 3, shift: "upper", step: 11 },
    { lane: 5, shift: "middle", step: 12 },
    { lane: 1, shift: "middle", step: 13 },
    { lane: 8, shift: "upper", step: 14 },
    { lane: 2, shift: "middle", step: 15 },
  ]);

  const [currentWord] = useState<Word>(words[0]);
  const [wordCursor, setWordCursor] = useState<number>(0);

  const [currentShift, setCurrentShift] = useState<Shift>("middle");

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <Board notes={notes} />
        <JudgeLine color={shiftToColor(currentShift)} />

        <WordDisplay word={currentWord} cursor={wordCursor} />
        <KeyboardLine keys={shiftToKeyboard(currentShift)} />

        <button onClick={() => setNotes(shiftNotes(notes))}>
          ノーツを進める
        </button>
        <button onClick={() => setWordCursor(wordCursor + 1)}>
          ワードの入力を1文字進める
        </button>
        <button onClick={() => setCurrentShift(nextShift(currentShift))}>
          シフトを切り替える
        </button>
      </div>
    </div>
  );
}

export default App;
