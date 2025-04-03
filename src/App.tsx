import { useCallback, useEffect, useState } from "react";
import { Word } from "./core";
import { PlayingScreen } from "./PlayingScreen";

type Shift = "upper" | "middle" | "lower";

/**
 * シフト切り替えのテスト用、あとで消す
 */
function nextShift(shift: Shift): Shift {
  if (shift === "upper") return "middle";
  if (shift === "middle") return "lower";
  return "upper";
}

const words: Word[] = [
  { display: "あいうえお", characters: "aiueo" },
  { display: "かきくけこ", characters: "kakikukeko" },
  { display: "こんにちは", characters: "konnnitiha" },
  { display: "よろしくお願いします", characters: "yorosikuonegaisimasu" },
];

type CharacterInputEvent = {
  key: string;
  time: number;
};

/**
 * デバッグ用
 */
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
  const [characterInput, setCharacterInput] = useState<CharacterInputEvent>();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const proceedToNextWord = useCallback(() => {
    console.log("次のワードに変更します");
    if (currentWordIndex === words.length - 1) {
      // TODO: 結果表示画面へ進む
      console.log("全てのワードを打ち終わりました");
      return;
    }
    setCurrentWordIndex((index) => index + 1);
  }, [currentWordIndex]);

  /** ゲームを開始する */

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
        <PlayingScreen
          word={words[currentWordIndex]}
          characterInputEvent={characterInput}
          proceedToNextWord={proceedToNextWord}
        />

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
