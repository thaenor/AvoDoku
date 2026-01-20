import { create } from 'zustand';

// --- Types ---
type Cell = {
  value: number | null;
  isGiven: boolean;
  isError: boolean;
  notes: number[];
};

type Grid = Cell[][];
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type GameState = {
  grid: Grid;
  selectedCell: { row: number; col: number } | null;
  history: Grid[];
  future: Grid[];
  difficulty: Difficulty;
};

type GameActions = {
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: number | null) => void;
  undo: () => void;
  redo: () => void;
  newGame: (difficulty: Difficulty) => void;
  checkErrors: () => void;
};

// --- Helper Functions ---

/**
 * Generates an empty 9x9 Sudoku grid.
 */
const generateEmptyGrid = (): Grid =>
  Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => ({
          value: null,
          isGiven: false,
          isError: false,
          notes: [],
        }))
    );

/**
 * Placeholder for a function that generates a new Sudoku puzzle.
 * For now, it returns a simple pre-filled grid.
 */
const generateNewPuzzle = (difficulty: Difficulty): Grid => {
    // In a real implementation, you would use a Sudoku generation algorithm.
    // This is a placeholder with a simple puzzle.
    const grid = generateEmptyGrid();
    const puzzle = [
        [5, 3, null, null, 7, null, null, null, null],
        [6, null, null, 1, 9, 5, null, null, null],
        [null, 9, 8, null, null, null, null, 6, null],
        [8, null, null, null, 6, null, null, null, 3],
        [4, null, null, 8, null, 3, null, null, 1],
        [7, null, null, null, 2, null, null, null, 6],
        [null, 6, null, null, null, null, 2, 8, null],
        [null, null, null, 4, 1, 9, null, null, 5],
        [null, null, null, null, 8, null, null, 7, 9],
    ];

    for(let r=0; r < 9; r++) {
        for(let c=0; c < 9; c++) {
            if(puzzle[r][c] !== null) {
                grid[r][c] = {
                    value: puzzle[r][c],
                    isGiven: true,
                    isError: false,
                    notes: []
                };
            }
        }
    }
    return grid;
};


// --- Zustand Store ---

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // --- Initial State ---
  grid: generateNewPuzzle('Medium'),
  selectedCell: null,
  history: [],
  future: [],
  difficulty: 'Medium',

  // --- Actions ---
  selectCell: (row, col) => {
    set({ selectedCell: { row, col } });
  },

  setCellValue: (value) => {
    const { grid, selectedCell } = get();
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const cell = grid[row][col];

    if (cell.isGiven) return;

    // Save current state to history
    set(state => ({
        history: [...state.history, state.grid],
        future: [] // Clear future on new action
    }));

    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
    newGrid[row][col].value = value;
    
    set({ grid: newGrid });
    get().checkErrors(); // Check for errors after setting value
  },

  undo: () => {
    const { history, grid } = get();
    if (history.length === 0) return;

    const previousGrid = history[history.length - 1];
    set({
      grid: previousGrid,
      history: history.slice(0, -1),
      future: [grid, ...get().future],
    });
  },

  redo: () => {
    const { future, grid } = get();
    if (future.length === 0) return;

    const nextGrid = future[0];
    set({
      grid: nextGrid,
      history: [...get().history, grid],
      future: future.slice(1),
    });
  },

  newGame: (difficulty) => {
    set({
      difficulty,
      grid: generateNewPuzzle(difficulty),
      selectedCell: null,
      history: [],
      future: [],
    });
    get().checkErrors();
  },

  checkErrors: () => {
    const { grid } = get();
    const newGrid: Grid = JSON.parse(JSON.stringify(grid));

    // Reset all errors first
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        newGrid[r][c].isError = false;
      }
    }

    const checkGroup = (group: Cell[]) => {
      const counts: { [key: number]: number[] } = {};
      group.forEach((cell, index) => {
        if (cell.value !== null) {
          if (!counts[cell.value]) {
            counts[cell.value] = [];
          }
          counts[cell.value].push(index);
        }
      });

      Object.values(counts).forEach(indices => {
        if (indices.length > 1) {
          indices.forEach(index => {
            group[index].isError = true;
          });
        }
      });
    };
    
    // 1. Check Rows
    for (let r = 0; r < 9; r++) {
        const rowCells = newGrid[r];
        checkGroup(rowCells);
    }
    
    // 2. Check Columns
    for (let c = 0; c < 9; c++) {
        const colCells = [];
        const originalIndices = [];
        for (let r = 0; r < 9; r++) {
            colCells.push(newGrid[r][c]);
            originalIndices.push({r, c});
        }
        
        const colCounts: { [key: number]: {r:number, c:number}[] } = {};
        colCells.forEach((cell, index) => {
            if (cell.value !== null) {
              if (!colCounts[cell.value]) {
                colCounts[cell.value] = [];
              }
              colCounts[cell.value].push(originalIndices[index]);
            }
        });

        Object.values(colCounts).forEach(coords => {
            if (coords.length > 1) {
                coords.forEach(({r, c}) => {
                    newGrid[r][c].isError = true;
                });
            }
        });
    }

    // 3. Check 3x3 Squares
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const squareCells = [];
        const originalIndices = [];
        for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
          for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
            squareCells.push(newGrid[r][c]);
            originalIndices.push({r, c});
          }
        }
        
        const squareCounts: { [key: number]: {r:number, c:number}[] } = {};
        squareCells.forEach((cell, index) => {
            if (cell.value !== null) {
              if (!squareCounts[cell.value]) {
                squareCounts[cell.value] = [];
              }
              squareCounts[cell.value].push(originalIndices[index]);
            }
        });

        Object.values(squareCounts).forEach(coords => {
            if (coords.length > 1) {
                coords.forEach(({r, c}) => {
                    newGrid[r][c].isError = true;
                });
            }
        });
      }
    }

    set({ grid: newGrid });
  },
}));
