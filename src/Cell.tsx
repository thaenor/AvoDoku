import React from 'react';

// --- Prop Types ---
interface CellProps {
  value: number | null;
  isGiven: boolean;
  isSelected: boolean;
  isRelated: boolean;
  isHighlighted: boolean;
  isError: boolean;
  notes?: number[];
  onClick: () => void;
}

// --- Component ---
export const Cell: React.FC<CellProps> = ({
  value,
  isGiven,
  isSelected,
  isRelated,
  isHighlighted,
  isError,
  notes = [],
  onClick,
}) => {
  // --- Style Calculation ---
  const cellClasses = [
    'flex',
    'items-center',
    'justify-center',
    'w-10', // Default 40px
    'h-10',
    'md:w-11', // Optimized for 842px width (44px)
    'md:h-11',
    'lg:w-[60px]', // Large screens 60px
    'lg:h-[60px]',
    'cursor-pointer',
    'transition-colors',
    'duration-150',
    'relative', // Needed for absolute positioning of notes
  ];

  // Font size - large for values, handled differently for notes
  if (value !== null) {
      cellClasses.push('text-xl md:text-2xl lg:text-3xl');
  }

  if (isGiven) {
    cellClasses.push('font-bold', 'text-text-given');
  } else {
    cellClasses.push('font-normal', 'text-text-user');
  }

  // --- State Styles ---
  if (isSelected) {
    // High contrast selection: dark background, white text, and a thick inset ring
    cellClasses.push('ring-4', 'ring-inset', 'ring-blue-600', 'z-10');

    if (isError) {
        // Error state takes precedence visually even when selected
        // We use !important on text color to override the default text colors set above
        cellClasses.push('bg-error-bg', '!text-error-text');
    } else {
        // Standard selection
        cellClasses.push('bg-cell-selected', '!text-cell-selected-text');
    }
  } else if (isError) {
    cellClasses.push('bg-error-bg', 'text-error-text');
  } else if (isHighlighted) {
    cellClasses.push('bg-blue-300'); // distinct from cell-related
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

      {/* Notes Overlay */}
      {value === null && notes.length > 0 && (
        <>
            {/* Single Note: Large, Handwritten, Grey */}
            {notes.length === 1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl text-gray-400 font-handwriting font-bold">
                        {notes[0]}
                    </span>
                </div>
            )}
             {/* Multiple Notes: Grid, Handwritten, Smaller */}
            {notes.length > 1 && (
                 <div className="grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none p-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <div key={num} className="flex items-center justify-center text-[10px] sm:text-xs font-handwriting font-bold text-gray-500 leading-none">
                            {notes.includes(num) ? num : ''}
                        </div>
                    ))}
                </div>
            )}
        </>
      )}
    </button>
  );
};
