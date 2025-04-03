import { useEffect, useState } from "react";
import { Word } from "./core";
import { PlayingScreen } from "./PlayingScreen";

type Shift = "upper" | "middle" | "lower";

/**
 * シフト切り替えのテスト用
 */
function nextShift(shift: Shift): Shift {
  if (shift === "upper") return "middle";
  if (shift === "middle") return "lower";
  return "upper";
}

const words: Word[] = [
  { display: "よろしくお願いします", characters: "yorosikuonegaisimasu" },
  { display: "あいうえお", characters: "aiueo" },
  { display: "かきくけこ", characters: "kakikukeko" },
  { display: "こんにちは", characters: "konnnitiha" },
];

type CharacterInputEvent = {
  key: string;
  time: number;
};

const DisplayInputCharacter = ({ event }: { event: CharacterInputEvent }) => {
  return (
    <div>
      <div>{event.key}</div>
      <div>{event.time}</div>
    </div>
  );
};

function App() {
  const [currentShift, setCurrentShift] = useState<Shift>("middle");

  /** ゲームを開始する */

  const [characterInput, setCharacterInput] = useState<CharacterInputEvent>();

  // キーボード入力を受け取る
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setCharacterInput({ key: event.key, time: Date.now() });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <PlayingScreen word={words[0]} characterInputEvent={characterInput} />

        {/* <button onClick={() => proceedToNextWord()}>次のワードに進む</button> */}
        <button onClick={() => setCurrentShift(nextShift(currentShift))}>
          シフトを切り替える
        </button>

        {characterInput && <DisplayInputCharacter event={characterInput} />}
      </div>
    </div>
  );
}

export default App;
