# Human-Style Difficulty Grading Implementation Plan

## Goal
Implement a logical solver to grade Sudoku puzzles based on the hardest technique required to solve them, rather than just counting clues. This ensures that "Easy" puzzles don't require advanced logic and "Hard" puzzles are rigorously valid.

## Phase 1: Create the Logic Engine (`src/utils/sudokuIterativeSolver.ts`)
- [x] Create `src/utils/sudokuIterativeSolver.ts`.
- [x] Implement `getCandidates(board, r, c)`: efficient candidate calculation.
- [x] Implement Strategy: **Naked Singles** (Cell has only 1 possible candidate).
- [x] Implement Strategy: **Hidden Singles** (Number can only go in 1 spot in a Row/Col/Box).
- [ ] Implement Strategy: **Naked Pairs** (Two cells in a unit share same 2 candidates).  *(Planned for future iteration if needed, starting with Singles)*.
- [x] Implement `attemptSolve(grid, difficulty)`:
    - **Easy**: Solvable using only Naked Singles & Hidden Singles.
    - **Medium**: Solvable using Singles + Naked Pairs (or just complex singles for now).
    - **Hard**: Fallback to brute-force unique check (accepts any logic).

## Phase 2: Integrate into Generation (`useGameStore.ts`)
- [x] Import `attemptSolve` in `src/useGameStore.ts`.
- [x] Update `generateNewPuzzle`:
    - After verifying uniqueness (`countSolutions === 1`):
    - Run `attemptSolve(checkBoard, targetDifficulty)`.
    - If it returns `false`, the removal made the puzzle too hard for the target difficulty: **Backtrack**.
    - If `true`, the removal is safe.

## Phase 3: Optimizations & Tuning
- [ ] Tune the strictness. If "Easy" generation fails too often (can't remove enough cells), consider loosening the constraints or initializing with a denser board.
