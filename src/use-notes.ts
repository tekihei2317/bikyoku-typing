import { useCallback, useState } from "react";
import { Note } from "./core";

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

type UseNoteReturn = {
  notes: Note[];
  setNewNotes: (characters: string) => void;
  shiftNotes: () => void;
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

/**
 * ノーツを一段下に下げる
 */
function shiftNotes(notes: Note[]): Note[] {
  return notes
    .filter((_, index) => index > 0)
    .map((note) => ({ ...note, step: note.step - 1 }));
}

export function useNotes(): UseNoteReturn {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleShiftNotes = useCallback(() => {
    setNotes(shiftNotes(notes));
  }, [notes]);

  const setNewNotes = useCallback((characters: string) => {
    setNotes(convertCharsToNotes(characters));
  }, []);

  return { notes, shiftNotes: handleShiftNotes, setNewNotes };
}
