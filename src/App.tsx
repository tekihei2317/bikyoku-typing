import { useCallback, useEffect, useMemo, useState } from "react";
import { Note, Word } from "./core";
import { PlayingScreen } from "./PlayingScreen";
import { convertCharsToNotes, shiftNotes } from "./use-notes";
import { ReadyScreen } from "./ReadyScreen";
import { ResultsScreen } from "./ResultScreen";
import { convertInputToCharacter } from "./keyboard-input";
import { useTimer } from "./use-timer";

// type Shift = "upper" | "middle" | "lower";

const words: Word[] = [
  { display: "ASDFG", characters: "asdfg" },
  { display: "HJKL;", characters: "hjkl;" },
  { display: "ASDFGHJKL;", characters: "asdfghjkl;" },
  { display: "QERTYUIOP", characters: "qwertyuiop" },
  { display: ";LKJHGFDSA", characters: ";lkjhgfdsa" },
  { display: "ZXCVNM,./", characters: "zxcvbnm,./" },
  { display: "あいうえお", characters: "aiueo" },
  { display: "かきくけこ", characters: "kakikukeko" },
  { display: "さしすせそ", characters: "sasisuseso" },
  { display: "答え", characters: "kotae" },
  { display: "刺身", characters: "sasimi" },
  { display: "平和", characters: "heiwa" },
  { display: "夕日", characters: "yuuhi" },
  { display: "おはようございます", characters: "ohayougozaimasu" },
  { display: "よろしくお願いします", characters: "yorosikuonegaisimasu" },
  {
    display: "今日も一日頑張りましょう",
    characters: "kyouumoitinitiganbarimasyou",
  },
];

type GameStatus = "Ready" | "Playing" | "Results";

type PlayingState = {
  notes: Note[];
  currentWordIndex: number;
  cursor: number;
};

type Layer = "upper" | "middle" | "lower";

const totalKeystrokes = words.reduce(
  (total, word) => total + word.characters.length,
  0
);

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("Ready");
  const [playingState, setPlayingState] = useState<PlayingState>();
  const [spacePressed, setSpacePressed] = useState(false);
  const [kanaPressed, setKanaPressed] = useState(false);

  const currentLayer = useMemo<Layer>(() => {
    if (spacePressed) return "upper";
    if (kanaPressed) return "lower";
    return "middle";
  }, [spacePressed, kanaPressed]);

  const { calculateKPM, ...timerUtil } = useTimer();
  const kpm = useMemo(() => {
    return calculateKPM(totalKeystrokes);
  }, [calculateKPM]);

  /** ゲームを開始する */
  const handleStart = useCallback(() => {
    setGameStatus("Playing");
    setPlayingState({
      cursor: 0,
      currentWordIndex: 0,
      notes: convertCharsToNotes(words[0].characters),
    });

    timerUtil.timer.reset();
    timerUtil.timer.start();
  }, [timerUtil]);

  /** ゲームをリスタートする */
  const handleRestart = useCallback(() => {
    setGameStatus("Ready");
  }, []);

  // キーボード入力を受け取る
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (playingState === undefined) return;

      const pressedKey = event.key;
      if (pressedKey === "KanjiMode" || pressedKey == "Convert") {
        setKanaPressed(true);
      }
      if (pressedKey === " ") {
        setSpacePressed(true);
      }

      const inputCharacter = convertInputToCharacter(pressedKey, {
        spacePressed,
        kanaPressed,
      });

      if (inputCharacter === undefined) {
        // 文字以外の入力の場合は無視する
        return;
      }

      const currentWord = words[playingState.currentWordIndex].characters;
      if (currentWord[playingState.cursor] !== inputCharacter) {
        return;
      }

      const newPlayingState: PlayingState = {
        ...playingState,
        cursor: playingState.cursor + 1,
        notes: shiftNotes(playingState.notes),
      };
      setPlayingState(newPlayingState);

      // 最後まで打ち終えたら、次のワードへ
      if (newPlayingState.notes.length === 0) {
        timerUtil.timer.stop();

        const currentWord = words[playingState.currentWordIndex];
        console.log(
          "KPM",
          timerUtil.calculateCurrentKPM(currentWord.characters.length)
        );

        const nextWordIndex = playingState.currentWordIndex + 1;
        if (nextWordIndex === words.length) {
          setGameStatus("Results");
          return;
        }

        setTimeout(() => {
          setPlayingState({
            currentWordIndex: playingState.currentWordIndex + 1,
            notes: convertCharsToNotes(words[nextWordIndex].characters),
            cursor: 0,
          });

          // ワード表示と同時にタイマーを再スタート
          timerUtil.timer.start();
        }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playingState, currentLayer, kanaPressed, spacePressed, timerUtil]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (playingState === undefined) return;

      if (event.key === "KanjiMode" || event.key === "Convert") {
        setKanaPressed(false);
      }
      if (event.key === " ") {
        setSpacePressed(false);
      }
    };
    window.addEventListener("keyup", handleKeyUp);

    return () => window.removeEventListener("keyup", handleKeyUp);
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
            layer={currentLayer}
          />
        )}
        {gameStatus === "Results" && (
          <ResultsScreen onRestart={() => handleRestart()} kpm={kpm} />
        )}
      </div>
    </div>
  );
}

export default App;
