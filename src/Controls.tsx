import React from 'react';
import { useGameStore } from './useGameStore';

export const Controls: React.FC = () => {
  const { setCellValue, undo, redo, history, future, selectedCell } = useGameStore();

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;
  const cellIsSelected = selectedCell !== null;

  // --- Action Button Styles ---
  const baseButton = "px-4 h-12 flex items-center justify-center rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium";
  const primaryButton = `${baseButton} bg-blue-500 text-white hover:bg-blue-600`;
  const secondaryButton = `${baseButton} bg-gray-200 text-gray-800 hover:bg-gray-300`;
  const disabledButton = "opacity-50 cursor-not-allowed";

  // --- Render ---
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* --- Action Buttons --- */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo last move"
          className={`${secondaryButton} ${!canUndo ? disabledButton : ''}`}
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo move"
          className={`${secondaryButton} ${!canRedo ? disabledButton : ''}`}
        >
          Redo
        </button>
      </div>

      {/* --- Number Pad & Clear --- */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => setCellValue(num)}
            disabled={!cellIsSelected}
            aria-label={`Set selected cell to ${num}`}
            className={`w-full min-w-[50px] h-14 text-2xl font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors ${!cellIsSelected ? disabledButton : ''}`}
          >
            {num}
          </button>
        ))}
         {/* Clear Button */}
         <button
            onClick={() => setCellValue(null)}
            disabled={!cellIsSelected}
            aria-label="Clear selected cell value"
            className={`w-full col-span-2 h-14 text-lg font-medium border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors ${!cellIsSelected ? disabledButton : ''}`}
        >
            Clear
        </button>
         {/* Hint Button (Optional) */}
         <button
            onClick={() => alert("Hint functionality not yet implemented!")}
            aria-label="Get a hint"
            className={`${baseButton} w-full h-14 bg-green-500 text-white hover:bg-green-600`}
        >
            Hint
        </button>
      </div>
    </div>
  );
};
