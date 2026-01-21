import React from 'react';
import { useGameStore } from './useGameStore';

export const Controls: React.FC = () => {
  const { setCellValue, undo, redo, history, future, selectedCell, getHint } = useGameStore();

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;
  const cellIsSelected = selectedCell !== null;

  // --- Action Button Styles ---
  const baseButton = "px-4 h-12 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-bold text-lg";
  const secondaryButton = `${baseButton} bg-gray-800 text-white hover:bg-black border-2 border-black`;
  const disabledButton = "opacity-40 cursor-not-allowed grayscale";

  // --- Render ---
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* --- Action Buttons --- */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          aria-label="Desfazer última jogada"
          className={`${secondaryButton} ${!canUndo ? disabledButton : ''}`}
        >
          Desfazer
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          aria-label="Refazer jogada"
          className={`${secondaryButton} ${!canRedo ? disabledButton : ''}`}
        >
          Refazer
        </button>
      </div>

      {/* --- Number Pad & Clear --- */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => setCellValue(num)}
            disabled={!cellIsSelected}
            aria-label={`Definir célula selecionada como ${num}`}
            className={`w-full min-w-[50px] h-14 text-2xl font-bold border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition-colors focus:ring-4 focus:ring-blue-500 ${!cellIsSelected ? disabledButton : ''}`}
          >
            {num}
          </button>
        ))}
         {/* Clear Button */}
         <button
            onClick={() => setCellValue(null)}
            disabled={!cellIsSelected}
            aria-label="Limpar valor da célula selecionada"
            className={`w-full col-span-2 h-14 text-xl font-bold border-4 border-red-700 text-red-700 rounded-lg hover:bg-red-50 transition-colors ${!cellIsSelected ? disabledButton : ''}`}
        >
            Limpar
        </button>
         {/* Hint Button (Optional) */}
         <button
            onClick={getHint}
            aria-label="Obter dica"
            className={`${baseButton} w-full h-14 bg-green-800 text-white hover:bg-green-900 border-2 border-green-950`}
        >
            Dica
        </button>
      </div>
    </div>
  );
};
