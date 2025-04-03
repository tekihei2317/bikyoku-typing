const layout = {
  upper: "qwertyuiop".split(""),
  middle: "asdfghjkl;".split(""),
  lower: "zxcvbnm,./".split(""),
};

/**
 * キーボードの入力を、このゲームで入力される文字に変換する
 */
export function convertInputToCharacter(
  key: string,
  option: { spacePressed: boolean; kanaPressed: boolean }
): string | undefined {
  const keyIndex = layout.middle.findIndex((k) => k === key);
  if (keyIndex === -1) {
    // 中段以外が押された場合は、無視する
    return undefined;
  }

  const layer: "upper" | "middle" | "lower" = option.spacePressed
    ? "upper"
    : option.kanaPressed
    ? "lower"
    : "middle";

  return layout[layer][keyIndex];
}
