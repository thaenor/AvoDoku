import React from 'react';

// --- Prop Types ---
interface CellProps {
  value: number | null;
  isGiven: boolean;
  isSelected: boolean;
  isRelated: boolean;
  isError: boolean;
  onClick: () => void;
}

// --- Component ---
export const Cell: React.FC<CellProps> = ({
  value,
  isGiven,
  isSelected,
  isRelated,
  isError,
  onClick,
}) => {
  // --- Style Calculation ---
  const cellClasses = [
    'flex',
    'items-center',
    'justify-center',
    'w-[60px]',
    'h-[60px]',
    'text-3xl',
    'cursor-pointer',
    'transition-colors',
    'duration-150',
  ];

  if (isGiven) {
    cellClasses.push('font-bold', 'text-text-given');
  } else {
    cellClasses.push('font-normal', 'text-text-user');
  }

  // --- State Styles ---
  if (isSelected) {
    // High contrast selection: dark background, white text, and a thick inset ring
    cellClasses.push('bg-cell-selected', '!text-cell-selected-text', 'ring-4', 'ring-inset', 'ring-blue-600', 'z-10');
  } else if (isError) {
    cellClasses.push('bg-error-bg', 'text-error-text');
  } else if (isRelated) {
    cellClasses.push('bg-cell-related');
  }

  // --- Render ---
  return (
    <button
      className={cellClasses.join(' ')}
      onClick={onClick}
      aria-label={value ? `Valor ${value}` : 'Célula vazia'}
      aria-selected={isSelected}
      aria-invalid={isError}
      aria-readonly={isGiven}
      role="gridcell"
      type="button"
    >
      {value}
    </button>
  );
};
