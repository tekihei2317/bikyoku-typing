type ResultsScreenProps = {
  kpm: number;
  onRestart: () => void;
};

export const ResultsScreen = ({ kpm, onRestart }: ResultsScreenProps) => {
  const tweetUrl = `https://twitter.com/intent/tweet?text=ホームタイピングで${kpm}KPMを記録しました！%20%23ホームタイピング`;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">結果発表</h2>
      <div className="text-4xl font-mono text-blue-600 mb-4">{kpm} KPM</div>
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition"
        >
          もう一度
        </button>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-400 text-white px-5 py-2 rounded-md hover:bg-blue-500 transition"
        >
          ツイート
        </a>
      </div>
    </div>
  );
};
