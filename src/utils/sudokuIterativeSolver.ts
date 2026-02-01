type Board = number[][];

// Helper: Get candidates for a specific cell
export const getCandidates = (board: Board, r: number, c: number): number[] => {
    if (board[r][c] !== 0) return [];

    const used = new Set<number>();

    // Check Row & Col
    for (let i = 0; i < 9; i++) {
        if (board[r][i] !== 0) used.add(board[r][i]);
        if (board[i][c] !== 0) used.add(board[i][c]);
    }

    // Check Box
    const boxR = Math.floor(r / 3) * 3;
    const boxC = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const val = board[boxR + i][boxC + j];
            if (val !== 0) used.add(val);
        }
    }

    const candidates: number[] = [];
    for (let num = 1; num <= 9; num++) {
        if (!used.has(num)) candidates.push(num);
    }
    return candidates;
};

// Strategy 1: Naked Singles
// Find cells with only 1 candidate.
const applyNakedSingles = (board: Board): boolean => {
    let changed = false;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                const candidates = getCandidates(board, r, c);
                if (candidates.length === 1) {
                    board[r][c] = candidates[0];
                    changed = true;
                }
            }
        }
    }
    return changed;
};

// Strategy 2: Hidden Singles
// Find a candidate number that appears only once in a row, col, or box.
const applyHiddenSingles = (board: Board): boolean => {
    let changed = false;

    // Helper to check frequencies in a list of cells
    const checkUnit = (cells: {r: number, c: number}[]) => {
        const counts: {[key: number]: number} = {};
        const positions: {[key: number]: {r: number, c: number}} = {};
        let unitChanged = false;

        // Count occurrences of each candidate in this unit
        for (const {r, c} of cells) {
            if (board[r][c] === 0) {
                const candidates = getCandidates(board, r, c);
                for (const num of candidates) {
                    counts[num] = (counts[num] || 0) + 1;
                    positions[num] = {r, c};
                }
            }
        }

        // If count is 1, we found a hidden single
        for (let num = 1; num <= 9; num++) {
            if (counts[num] === 1) {
                const {r, c} = positions[num];
                if (board[r][c] === 0) {
                     board[r][c] = num;
                     unitChanged = true;
                }
            }
        }
        return unitChanged;
    };

    // Rows
    for (let r = 0; r < 9; r++) {
        const cells = [];
        for (let c = 0; c < 9; c++) cells.push({r, c});
        if (checkUnit(cells)) changed = true;
    }

    // Cols
    for (let c = 0; c < 9; c++) {
        const cells = [];
        for (let r = 0; r < 9; r++) cells.push({r, c});
        if (checkUnit(cells)) changed = true;
    }

    // Boxes
    for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
             const cells = [];
             for (let i = 0; i < 3; i++) {
                 for (let j = 0; j < 3; j++) {
                     cells.push({r: br*3+i, c: bc*3+j});
                 }
             }
             if (checkUnit(cells)) changed = true;
        }
    }

    return changed;
};

// Check if solved
const isSolved = (board: Board): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) return false;
        }
    }
    return true;
};

// Main Solver
// Returns TRUE if the puzzle can be solved using the allowed techniques for the given difficulty
export const attemptSolve = (board: Board, difficulty: 'Easy' | 'Medium' | 'Hard'): boolean => {
    // Deep copy to simulate solving without affecting the actual generation board
    const clone = board.map(row => [...row]);

    let stuck = false;
    while (!stuck && !isSolved(clone)) {
        let progress = false;

        // 1. Naked Singles (Everything uses this)
        if (applyNakedSingles(clone)) {
             progress = true;
             continue; // Restart loop to see if new simple moves opened up
        }

        // 2. Hidden Singles (Easy+ uses this)
        // Note: Some definitions say Easy = Naked Only, Medium = Hidden.
        // But Hidden Single is pretty fundamental.
        if (['Easy', 'Medium', 'Hard'].includes(difficulty)) {
             if (applyHiddenSingles(clone)) {
                 progress = true;
                 continue;
             }
        }

        // Future: Medium logic (Pointing, Pairs)
        /*
        if (['Medium', 'Hard'].includes(difficulty)) {
             if (applyNakedPairs(clone)) {
                 progress = true;
                 continue;
             }
        }
        */

        if (!progress) {
             stuck = true;
        }
    }

    const solved = isSolved(clone);

    if (difficulty === 'Easy') {
        return solved;
    }

    if (difficulty === 'Medium') {
        return solved;
    }

    // Hard allows advanced logic (X-Wing, etc) which we don't simulate here.
    // If it's Hard, we assume the Uniqueness check (done externally) is sufficient validity.
    // So we always return true because we are asking "Is this solvable within Hard constraints?"
    // Yes, anything unique is solvable with "Hard" logic (Backtracking aka Brute Force is the ultimate Hard logic).
    return true;
};
