type ReadyScreenProps = {
  onStart: () => void;
};

export const ReadyScreen = ({ onStart }: ReadyScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-24 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          ホームタイピング（仮）
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          ホームポジションだけで遊べる音ゲー風タイピングゲーム
        </p>
        <button
          onClick={onStart}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          スタート！
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 max-w-xl w-full text-gray-700 leading-relaxed">
        <h2 className="text-2xl font-bold mb-6 text-center">🎮 遊び方</h2>

        <p className="mb-4">
          このゲームで使用するキーは、ホームポジションの10キーと、
          スペースキー、変換キー（Windows）またはかなキー（Mac）です。
        </p>

        <p className="mb-4">
          スペースキーや変換キーを押すことで、判定ラインの色が変化します。
        </p>

        <p className="mb-4">
          スペースキーや変換キーを押しながら、判定ラインの色をノーツの色と揃えて、
          ノーツのある列のキーを同時に押してください。
        </p>

        <div className="mb-2 font-semibold">判定ラインの色：</div>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>初期状態：黄色</li>
          <li>スペースキーを押す：赤色</li>
          <li>変換キー（かなキー）を押す：青色</li>
        </ul>
      </div>
    </div>
  );
};
