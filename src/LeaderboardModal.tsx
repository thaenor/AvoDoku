import React from 'react';
import { useGameStore } from './useGameStore';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { completedGames } = useGameStore();

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="leaderboard-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border-4 border-gray-900">
        <div className="flex justify-between items-center mb-6">
            <h2 id="leaderboard-title" className="text-3xl font-extrabold text-gray-900">Histórico de Jogos</h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-black font-bold text-xl px-4 py-2 rounded focus:ring-2 focus:ring-gray-500"
                aria-label="Fechar histórico"
            >
                ✕
            </button>
        </div>

        <div className="overflow-y-auto flex-1">
            {completedGames.length === 0 ? (
                <p className="text-center text-gray-500 text-lg py-8">Ainda não há jogos completados.</p>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="py-2 font-bold text-lg px-2">Data</th>
                            <th className="py-2 font-bold text-lg px-2">Dificuldade</th>
                            <th className="py-2 font-bold text-lg text-right px-2">Tempo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedGames.map((game) => (
                            <tr key={game.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 text-gray-800 px-2">{formatDate(game.date)}</td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded-md text-sm font-bold
                                        ${game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                          game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        {game.difficulty === 'Easy' ? 'Fácil' : game.difficulty === 'Medium' ? 'Médio' : 'Difícil'}
                                    </span>
                                </td>
                                <td className="py-3 text-right font-mono font-medium px-2">{formatTime(game.time)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};
