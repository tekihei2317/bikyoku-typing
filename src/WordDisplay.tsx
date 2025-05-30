import { Word } from "./core";

/**
 * ワードを表示する
 */
export const WordDisplay = ({
  word,
  cursor,
}: {
  word: Word;
  cursor: number;
}) => {
  return (
    <div className="text-center">
      <div className="text-3xl font-semibold text-gray-800">{word.display}</div>
      <div className="text-2xl tracking-wider mt-1 text-gray-800">
        {word.characters.split("").map((char, index) => (
          <span key={index} className={index < cursor ? "invisible" : ""}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};
