/**
 * ワード
 */
export type Word = {
  /** 表示する文字列 */
  display: string;
  /** 入力する文字列 */
  characters: string;
};

/**
 * ノーツ
 */
export type Note = {
  lane: number;
  shift: "upper" | "middle" | "lower";
  step: number;
};
