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

  if (isSelected && !isError) {
    cellClasses.push('bg-cell-selected');
  } else if (isRelated && !isError) {
    cellClasses.push('bg-cell-related');
  }

  if (isError) {
    cellClasses.push('bg-error-soft');
  }

  // --- Render ---
  return (
    <div className={cellClasses.join(' ')} onClick={onClick}>
      {value}
    </div>
  );
};
