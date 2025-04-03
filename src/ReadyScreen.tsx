type ReadyScreenProps = {
  onStart: () => void;
};

export const ReadyScreen = ({ onStart }: ReadyScreenProps) => {
  return (
    <div className="flex w-xl flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-8">ホームタイピング</h1>
      <p className="mb-6 text-lg text-gray-600">
        ホームポジションだけで遊べる音ゲー風タイピングゲーム
      </p>
      <button
        onClick={onStart}
        className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transition"
      >
        スタート！
      </button>
    </div>
  );
};
