import React from 'react';
import { useGameStore } from './useGameStore';
import { Cell } from './Cell';

export const Board: React.FC = () => {
  const { grid, selectedCell, selectCell } = useGameStore();

  const isRelated = (row: number, col: number, selected: {row: number, col: number} | null) => {
    if (!selected) return false;
    if (selected.row === row && selected.col === col) return false; // Not related to itself

    const inSameRow = selected.row === row;
    const inSameCol = selected.col === col;
    
    const selectedBoxRow = Math.floor(selected.row / 3);
    const selectedBoxCol = Math.floor(selected.col / 3);
    const currentBoxRow = Math.floor(row / 3);
    const currentBoxCol = Math.floor(col / 3);
    const inSameBox = selectedBoxRow === currentBoxRow && selectedBoxCol === currentBoxCol;

    return inSameRow || inSameCol || inSameBox;
  }

  return (
    <div className="grid grid-cols-9 border-t-4 border-l-4 border-grid-thick">
      {grid.map((row, r_idx) =>
        row.map((cell, c_idx) => {
          const isCellSelected = selectedCell?.row === r_idx && selectedCell?.col === c_idx;
          
          const borderClasses = [
            'border-r-2',
            'border-b-2',
            'border-grid-thin'
          ];

          if (c_idx === 2 || c_idx === 5) {
            borderClasses.push('border-r-4', 'border-r-grid-thick');
          }
          if (r_idx === 2 || r_idx === 5) {
            borderClasses.push('border-b-4', 'border-b-grid-thick');
          }

          return (
            <div key={`${r_idx}-${c_idx}`} className={borderClasses.join(' ')}>
              <Cell
                value={cell.value}
                isGiven={cell.isGiven}
                isError={cell.isError}
                isSelected={isCellSelected}
                isRelated={isRelated(r_idx, c_idx, selectedCell)}
                onClick={() => selectCell(r_idx, c_idx)}
              />
            </div>
          );
        })
      )}
    </div>
  );
};
