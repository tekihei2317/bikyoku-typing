import { useCallback, useState } from "react";
import { Word } from "./core";

type WordState = {
  currentWord: Word;
  /** 何番目のワードか */
  currentWordIndex: number;
  /** ワードの何文字目を入力しているか */
  cursor: number;
};

type UseWordStateReturn = {
  wordState: WordState | undefined;
  proceedToNextWord: () => void;
  advanceCursor: () => void;
};

const words: Word[] = [
  { display: "よろしくお願いします", characters: "yorosikuonegaisimasu" },
  { display: "あいうえお", characters: "aiueo" },
  { display: "かきくけこ", characters: "kakikukeko" },
  { display: "こんにちは", characters: "konnnitiha" },
];

export function useWordState(): UseWordStateReturn {
  const [wordState, setWordState] = useState<WordState>();

  const proceedToNextWord = useCallback(() => {
    if (wordState === undefined) {
      // 未定義→初期状態
      setWordState({
        currentWord: words[0],
        currentWordIndex: 0,
        cursor: 0,
      });
    } else if (wordState.currentWordIndex < words.length - 1) {
      // 次のワードがある場合
      setWordState({
        currentWord: words[wordState.currentWordIndex + 1],
        currentWordIndex: wordState.currentWordIndex + 1,
        cursor: 0,
      });
    } else {
      // 次のワードがない場合は、何もしない
      return;
    }
  }, [wordState]);

  const advanceCursor = useCallback(() => {
    if (wordState === undefined) {
      return;
    }

    // カーソルがまだ進められる場合は、進める
    if (wordState.cursor < wordState.currentWord.characters.length) {
      setWordState({
        ...wordState,
        cursor: wordState.cursor + 1,
      });
    }
  }, [wordState]);

  return {
    wordState,
    proceedToNextWord,
    advanceCursor,
  };
}
