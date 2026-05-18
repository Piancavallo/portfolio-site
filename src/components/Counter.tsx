// src/components/Counter.tsx
// Example React island — replace or delete once you build real components.
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 p-4">
      <button
        onClick={() => setCount((c) => c - 1)}
        className="size-8 rounded-md bg-gray-100 hover:bg-gray-200"
      >
        −
      </button>
      <span className="w-6 text-center font-mono">{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="size-8 rounded-md bg-gray-100 hover:bg-gray-200"
      >
        +
      </button>
    </div>
  );
}
