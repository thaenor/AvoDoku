import React, { useState, useEffect } from 'react';
import { Board } from './Board';
import { Controls } from './Controls';
import { useGameStore } from './useGameStore';
import { LeaderboardModal } from './LeaderboardModal';

function App() {
  const {
    newGame,
    difficulty: currentDifficulty,
    setCellValue,
    isWon,
    elapsedTime,
    incrementTime
  } = useGameStore();

  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'Easy' | 'Medium' | 'Hard'
  >(currentDifficulty);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isWon) {
      interval = setInterval(() => {
        incrementTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWon, incrementTime]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isWon) return; // Disable controls if game is won

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
  }, [setCellValue, isWon]);

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
          <div className="px-6 py-3 rounded-lg bg-gray-800 text-white font-mono text-xl border-2 border-black shadow-lg" aria-label={`Tempo decorrido: ${formatTime(elapsedTime)}`}>
            {formatTime(elapsedTime)}
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-6 py-3 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-lg font-bold text-lg border-2 border-purple-900"
            aria-label="Ver histórico de jogos"
          >
            Histórico
          </button>
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

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Victory Modal */}
      {isWon && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="victory-title"
          aria-modal="true"
        >
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center border-4 border-green-600">
            <h2
              id="victory-title"
              className="text-4xl font-extrabold text-green-700 mb-4"
            >
              Parabéns!
            </h2>
            <p className="text-xl font-bold text-gray-800 mb-2">
              Concluiu o Sudoku com sucesso!
            </p>
            <p className="text-lg font-medium text-gray-600 mb-8">
              Tempo: {formatTime(elapsedTime)}
            </p>
            <button
              onClick={handleNewGame}
              className="w-full px-6 py-4 rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors shadow-lg font-bold text-xl border-2 border-green-900 focus:ring-4 focus:ring-green-500"
              autoFocus
            >
              Novo Jogo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
