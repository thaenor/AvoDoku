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
    incrementTime,
    toggleNoteMode
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
      // Toggle Note Mode with 'N'
      else if (key.toLowerCase() === 'n') {
        toggleNoteMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCellValue, isWon, toggleNoteMode]);

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
    <div className="flex flex-col md:flex-row items-center justify-center min-dh-screen h-screen bg-bg-main w-full p-1 gap-2 overflow-hidden">

      {/* --- Left Column: Board --- */}
      <main className="flex-shrink-0 flex items-center justify-center h-full">
        <div className="scale-90 md:scale-100 transition-transform">
             <Board />
        </div>
      </main>

      {/* --- Right Column: Header Info & Controls --- */}
      <aside className="flex flex-col items-center justify-center w-full max-w-sm space-y-1 h-full overflow-y-auto">

        {/* HUD: Timer & Difficulty Group */}
        <div className="w-full bg-gray-100 p-2 rounded-xl border border-gray-300 shadow-sm flex flex-col gap-2">
             <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg p-1 px-3 shadow-inner border border-gray-900">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Tempo</span>
                <span className="font-mono text-xl font-bold tracking-widest" aria-label={`Tempo decorrido: ${formatTime(elapsedTime)}`}>
                    {formatTime(elapsedTime)}
                </span>
             </div>

             <div className="grid grid-cols-2 gap-1">
                <select
                    value={selectedDifficulty}
                    onChange={handleDifficultyChange}
                    className="w-full px-2 py-1 rounded-lg bg-white text-black border border-gray-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Selecionar dificuldade"
                >
                    <option value="Easy">Fácil</option>
                    <option value="Medium">Médio</option>
                    <option value="Hard">Difícil</option>
                </select>

                <button
                    onClick={() => setIsLeaderboardOpen(true)}
                    className="w-full px-2 py-1 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 border border-purple-800 transition-colors"
                    aria-label="Ver histórico de jogos"
                >
                    Histórico
                </button>
             </div>

            {/* New Game Button - Integrated */}
            <button
                onClick={handleNewGame}
                className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm font-bold text-lg border-2 border-blue-800 uppercase tracking-wide"
                aria-label="Começar novo jogo"
            >
                Novo Jogo
            </button>
        </div>

        {/* Controls Component */}
        <div className="w-full flex-grow flex items-center">
             <Controls />
        </div>
      </aside>

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
