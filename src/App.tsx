import React, { useState } from 'react';
import { Board } from './Board';
import { Controls } from './Controls';
import { useGameStore } from './useGameStore';

function App() {
  const { newGame, difficulty: currentDifficulty } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'Easy' | 'Medium' | 'Hard'
  >(currentDifficulty);

  const handleNewGame = () => {
    newGame(selectedDifficulty);
  };

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDiff = event.target.value as 'Easy' | 'Medium' | 'Hard';
    setSelectedDifficulty(newDiff);
    newGame(newDiff); // Start a new game immediately with new difficulty
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main min-w-[768px] p-4">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-text-primary mb-4">
          AvoDoku
        </h1>
        <div className="flex items-center space-x-4 justify-center">
          <button
            onClick={handleNewGame}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
            aria-label="Start a new game"
          >
            New Game
          </button>
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-md"
            aria-label="Select difficulty"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </header>

      {/* Main Content (Board) */}
      <main className="my-6">
        <Board />
      </main>

      {/* Controls (Number Pad) */}
      <section className="my-6">
        <Controls />
      </section>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Select a cell, then pick a number or use the controls below.
        </p>
      </footer>
    </div>
  );
}

export default App;
