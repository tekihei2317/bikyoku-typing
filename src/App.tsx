import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex justify-center">
      <div className="max-w-3xl">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
