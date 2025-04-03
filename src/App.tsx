import { useCallback, useEffect, useState } from "react";
import { Note, Word } from "./core";
import { PlayingScreen } from "./PlayingScreen";
import { convertCharsToNotes, shiftNotes } from "./use-notes";

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

type GameStatus = "Ready" | "Playing" | "Results";

type ReadyScreenProps = {
  onStart: () => void;
};
const ReadyScreen = ({ onStart }: ReadyScreenProps) => {
  return (
    <div>
      <button onClick={() => onStart()}>スタート</button>
    </div>
  );
};

type ResultScreenProps = {
  onRestart: () => void;
};
const ResultsScreen = ({ onRestart }: ResultScreenProps) => {
  return (
    <div>
      結果:
      <button onClick={() => onRestart()}>再挑戦</button>
    </div>
  );
};

type PlayingState = {
  notes: Note[];
  currentWordIndex: number;
  cursor: number;
};

function App() {
  const [currentShift, setCurrentShift] = useState<Shift>("middle");
  const [gameStatus, setGameStatus] = useState<GameStatus>("Ready");

  const [playingState, setPlayingState] = useState<PlayingState>();

  /** ゲームを開始する */
  const handleStart = useCallback(() => {
    setGameStatus("Playing");
    setPlayingState({
      cursor: 0,
      currentWordIndex: 0,
      notes: convertCharsToNotes(words[0].characters),
    });
  }, []);

  /** ゲームをリスタートする */
  const handleRestart = useCallback(() => {
    setGameStatus("Ready");
  }, []);

  // キーボード入力を受け取る
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (playingState === undefined) return;

      // キー入力が合っていると仮定する
      const inputCharacter = event.key;
      console.log(inputCharacter, "が入力されました");
      console.log(playingState);

      const newPlayingState: PlayingState = {
        ...playingState,
        cursor: playingState.cursor + 1,
        notes: shiftNotes(playingState.notes),
      };
      setPlayingState(newPlayingState);

      // 最後まで打ち終えたら、次のワードへ
      if (newPlayingState.notes.length === 0) {
        const nextWordIndex = playingState.currentWordIndex + 1;

        if (nextWordIndex === words.length) {
          setGameStatus("Results");
          return;
        }

        setTimeout(
          () =>
            setPlayingState({
              currentWordIndex: playingState.currentWordIndex + 1,
              notes: convertCharsToNotes(words[nextWordIndex].characters),
              cursor: 0,
            }),
          500
        );
      }
    };

    console.log("イベントリスナ登録");
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playingState]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        {gameStatus === "Ready" && (
          <ReadyScreen onStart={() => handleStart()} />
        )}
        {gameStatus === "Playing" && playingState && (
          <PlayingScreen
            notes={playingState.notes}
            currentWord={words[playingState.currentWordIndex]}
            cursor={playingState.cursor}
          />
        )}
        {gameStatus === "Results" && (
          <ResultsScreen onRestart={() => handleRestart()} />
        )}

        <button onClick={() => setCurrentShift(nextShift(currentShift))}>
          シフトを切り替える
        </button>
      </div>
    </div>
  );
}

export default App;
