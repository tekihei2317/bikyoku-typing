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
  setNewWord: (newWord: Word) => void;
  advanceCursor: () => void;
};

export function useWordState(): UseWordStateReturn {
  const [wordState, setWordState] = useState<WordState>();

  const setNewWord = useCallback(
    (newWord: Word) =>
      setWordState({
        currentWord: newWord,
        currentWordIndex: 0,
        cursor: 0,
      }),
    []
  );

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
    setNewWord,
    advanceCursor,
  };
}
