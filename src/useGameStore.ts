import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  isWon: boolean;
};

type GameActions = {
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: number | null) => void;
  undo: () => void;
  redo: () => void;
  newGame: (difficulty: Difficulty) => void;
  checkErrors: () => void;
  getHint: () => void;
};

// --- Helper Functions ---

const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
};

const solveSudoku = (board: number[][]): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, r, c, num)) {
                        board[r][c] = num;
                        if (solveSudoku(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

const fillGrid = (board: number[][]): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                for (const num of nums) {
                    if (isValidMove(board, r, c, num)) {
                        board[r][c] = num;
                        if (fillGrid(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

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
 * Generates a new Sudoku puzzle based on difficulty.
 */
const generateNewPuzzle = (difficulty: Difficulty): Grid => {
    // 1. Generate full board
    const raw = Array(9).fill(null).map(() => Array(9).fill(0));
    fillGrid(raw);

    // 2. Remove cells based on difficulty
    // Easy: ~40 cells removed
    // Medium: ~50 cells removed
    // Hard: ~60 cells removed
    let cellsToRemove = 40;
    if (difficulty === 'Medium') cellsToRemove = 50;
    if (difficulty === 'Hard') cellsToRemove = 60;

    let attempts = 0;
    while (cellsToRemove > 0 && attempts < 200) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);

        if (raw[r][c] !== 0) {
            raw[r][c] = 0;
            cellsToRemove--;
        }
        attempts++;
    }

    // 3. Convert to state Grid
    const grid = generateEmptyGrid();
    for(let r=0; r < 9; r++) {
        for(let c=0; c < 9; c++) {
            if(raw[r][c] !== 0) {
                grid[r][c] = {
                    value: raw[r][c],
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

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // --- Initial State ---
      grid: generateNewPuzzle('Medium'),
      selectedCell: null,
      history: [],
      future: [],
      difficulty: 'Medium',
      isWon: false,

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
        set((state) => ({
          history: [...state.history, state.grid],
          future: [], // Clear future on new action
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
        // Re-check errors/win on undo
        get().checkErrors();
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
        // Re-check errors/win on redo
        get().checkErrors();
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

          Object.values(counts).forEach((indices) => {
            if (indices.length > 1) {
              indices.forEach((index) => {
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
          const originalIndices: { r: number; c: number }[] = [];
          for (let r = 0; r < 9; r++) {
            colCells.push(newGrid[r][c]);
            originalIndices.push({ r, c });
          }

          const colCounts: { [key: number]: { r: number; c: number }[] } = {};
          colCells.forEach((cell, index) => {
            if (cell.value !== null) {
              if (!colCounts[cell.value]) {
                colCounts[cell.value] = [];
              }
              colCounts[cell.value].push(originalIndices[index]);
            }
          });

          Object.values(colCounts).forEach((coords) => {
            if (coords.length > 1) {
              coords.forEach(({ r, c }) => {
                newGrid[r][c].isError = true;
              });
            }
          });
        }

        // 3. Check 3x3 Squares
        for (let boxRow = 0; boxRow < 3; boxRow++) {
          for (let boxCol = 0; boxCol < 3; boxCol++) {
            const squareCells = [];
            const originalIndices: { r: number; c: number }[] = [];
            for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
              for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
                squareCells.push(newGrid[r][c]);
                originalIndices.push({ r, c });
              }
            }

            const squareCounts: { [key: number]: { r: number; c: number }[] } =
              {};
            squareCells.forEach((cell, index) => {
              if (cell.value !== null) {
                if (!squareCounts[cell.value]) {
                  squareCounts[cell.value] = [];
                }
                squareCounts[cell.value].push(originalIndices[index]);
              }
            });

            Object.values(squareCounts).forEach((coords) => {
              if (coords.length > 1) {
                coords.forEach(({ r, c }) => {
                  newGrid[r][c].isError = true;
                });
              }
            });
          }
        }

        // Check for win condition
        let errorFound = false;
        let emptyFound = false;
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (newGrid[r][c].isError) errorFound = true;
            if (newGrid[r][c].value === null) emptyFound = true;
          }
        }

        set({ grid: newGrid, isWon: !errorFound && !emptyFound });
      },

      getHint: () => {
        const { grid, selectedCell } = get();

        // 1. Create a representation of the board with ONLY givens to solve
        const solverBoard: number[][] = grid.map((row) =>
          row.map((cell) => (cell.isGiven ? cell.value || 0 : 0))
        );

        // 2. Solve the board
        const solution = JSON.parse(JSON.stringify(solverBoard)); // Deep copy to fill
        const solved = solveSudoku(solution);

        if (!solved) {
          console.error('Could not solve current puzzle configuration!');
          return;
        }

        // 3. Determine which cell to hint
        let targetRow = -1;
        let targetCol = -1;

        // If a cell is selected and it is empty or incorrect, hint that one
        if (selectedCell) {
          const { row, col } = selectedCell;
          const currentVal = grid[row][col].value;
          const correctVal = solution[row][col];

          if (currentVal !== correctVal) {
            targetRow = row;
            targetCol = col;
          }
        }

        // If no suitable selected cell, find the first empty or incorrect cell
        if (targetRow === -1) {
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              const currentVal = grid[r][c].value;
              const correctVal = solution[r][c];
              if (currentVal !== correctVal) {
                targetRow = r;
                targetCol = c;
                break;
              }
            }
            if (targetRow !== -1) break;
          }
        }

        // 4. Apply the hint
        if (targetRow !== -1 && targetCol !== -1) {
          const { selectCell } = get();
          // Select the cell if not already
          if (
            !selectedCell ||
            selectedCell.row !== targetRow ||
            selectedCell.col !== targetCol
          ) {
            selectCell(targetRow, targetCol);
          }

          // We need to bypass the isGiven check or standard setCellValue if we want special behavior
          // But for now, just calling setCellValue with the correct value is enough.
          // NOTE: setCellValue calls get() again, so we need to be careful about state if we didn't just update it?
          // Actually setCellValue uses get() freshly.

          // We can just call setCellValue.
          // OPTIONAL: We could mark it as a "hinted" cell if we added that property to Cell type.
          // For now, just filling in the value.

          // If we want to avoid polluting history with just a selection change, we might want to manually update.
          // But reusing setCellValue handles validation and history.

          // Wait, if I call selectCell then setCellValue, it triggers 2 renders/updates.
          // `setCellValue` uses `get().selectedCell`.

          // Let's manually do it to ensure atomicity or just call the actions.
          // Calling actions is safer.

          // Wait, setCellValue adds to history.

          get().setCellValue(solution[targetRow][targetCol]);
        }
      },
    }),
    {
      name: 'avodoku-storage',
      partialize: (state) => ({
        grid: state.grid,
        history: state.history,
        future: state.future,
        difficulty: state.difficulty,
        isWon: state.isWon,
        // We probably don't want to persist 'selectedCell' as that might be weird on reload
      }),
    }
  )
);
