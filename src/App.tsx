import React, { useState, useEffect } from 'react';
import { Board } from './Board';
import { Controls } from './Controls';
import { useGameStore } from './useGameStore';

function App() {
  const { newGame, difficulty: currentDifficulty, setCellValue } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'Easy' | 'Medium' | 'Hard'
  >(currentDifficulty);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // Check for numbers 1-9
      if (/^[1-9]$/.test(key)) {
        setCellValue(parseInt(key, 10));
      }
      // Check for Backspace or Delete to clear cell
      else if (key === 'Backspace' || key === 'Delete') {
        setCellValue(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCellValue]);

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
            className="px-6 py-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-lg font-bold text-lg border-2 border-blue-900"
            aria-label="Começar novo jogo"
          >
            Novo Jogo
          </button>
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="px-6 py-3 rounded-lg bg-white text-black border-4 border-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-colors shadow-lg font-bold text-lg"
            aria-label="Selecionar dificuldade"
          >
            <option value="Easy">Fácil</option>
            <option value="Medium">Médio</option>
            <option value="Hard">Difícil</option>
          </select>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full max-w-6xl">
        {/* Main Content (Board) */}
        <main className="my-6">
          <Board />
        </main>

        {/* Controls (Number Pad) */}
        <section className="my-6 lg:mt-6 w-full max-w-sm">
          <Controls />
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-lg font-medium text-gray-900">
          Selecione uma célula, depois escolha um número ou use os controlos abaixo.
        </p>
      </footer>
    </div>
  );
}

export default App;
