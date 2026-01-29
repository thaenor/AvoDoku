# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.7] - 2026-01-29

### Changed
-   **Immediate Error Checking**:
    -   Updated the core game logic to validate user input against the actual puzzle solution immediately.
    -   Incorrect numbers (wrong placement) now turn red immediately upon entry.
    -   **Persistent Errors**: Visual error indicators (red tiles) now persist until corrected, ensuring the user is always aware of mistakes on the board.
    -   Refactored `checkErrors` to compare against the stored solution rather than just checking for row/column conflicts.
-   **Performance & Stability**:
    -   Optimized `Hint` system and error checking by storing the solution grid at the start of the game.
    -   Fixed an issue where game state persistence would lose the solution data on reload, ensuring consistent error checking across sessions.
    -   **Visual Fix**: Resolved an issue where the "Selected" state color (blue) masked the "Error" state color (red). Immediate errors are now clearly visible even while the cell remains selected.

## [0.1.6] - 2026-01-21

### Added
-   **Notes Mode (Pencil Marks)**:
    -   Implemented a "Notes" mode allowing users to annotate empty cells with potential numbers.
    -   **Controls**: Added a "Notas: ON/OFF" toggle button and bound the `N` key as a keyboard shortcut.
    -   **Styling**: Integrated the "Caveat" handwriting font for a realistic pencil-mark aesthetic.
        -   Single notes appear large and greyed out.
        -   Multiple notes automatically resize to a 3x3 mini-grid within the cell.
    -   **Logic**: Entering a definitive value automatically clears any notes in that cell.

## [0.1.5] - 2026-01-21

### Improved
-   **User Experience**:
    -   The Leaderboard modal now closes when clicking on the dark background overlay, improving accessibility and ease of use.

## [0.1.4] - 2026-01-21

### Added
-   **Game History**:
    -   Implemented a `LeaderboardModal` to display a list of completed games (Date, Difficulty, Time).
    -   Updated `useGameStore` to track `completedGames` and strictly record completions only once per game instance.
    -   Added a "Histórico" button to the main header to access the leaderboard.
-   **Timer**:
    -   Added visual timer to the HUD and win screen (previously added in 0.1.3 but refined here).

## [0.1.3] - 2026-01-21

### Changed
-   **Puzzle Generation**:
    -   Replaced the static placeholder puzzle with a dynamic generator.
    -   Implemented a randomized backtracking algorithm to create unique full boards.
    -   Implemented a cell removal strategy based on the selected difficulty level (Easy: ~40 removed, Medium: ~50 removed, Hard: ~60 removed).

## [0.1.2] - 2026-01-21

### Added
-   **Localization**:
    -   Translated the entire application into European Portuguese (pt-PT).
    -   Updated `index.html` lang attribute.
    -   Localized UI labels (buttons, dropdowns) and accessibility labels (`aria-label`).
-   **Features**:
    -   **Hint System**: Implemented a backtracking Sudoku solver to provide intelligent hints. The hint fills the selected cell with the correct value or finds the first error/empty cell if no specific cell is selected.
    -   **Victory Condition**: Added logic to detect when the game is successfully completed (no errors and no empty cells).
    -   **Victory Modal**: Added an accessible high-contrast modal that appears upon winning, allowing the user to start a new game immediately.
    -   **Persistence**: Implemented `localStorage` persistence using Zustand's `persist` middleware. Game state (grid, history, difficulty, win state) is now saved across page reloads.

## [0.1.1] - 2026-01-20

### Added
-   **Keyboard Support**:
    -   Implemented global keyboard event listeners in `App.tsx`.
    -   Users can now type numbers `1-9` to input values into the selected cell.
    -   Users can press `Backspace` or `Delete` keys to clear the selected cell.

### Fixed
-   **Build Configuration**:
    -   Created a missing `tsconfig.json` to properly configure the TypeScript compiler for the Vite/React environment.
-   **Code Quality**:
    -   Resolved an unused variable warning in `Controls.tsx` (`primaryButton`).
    -   Fixed implicit `any` type errors and unused parameter warnings in `useGameStore.ts` to ensure a clean build.

## [0.1.0] - 2026-01-20

### Added

-   **Initial Project Setup**:
    -   Initialized a new React + TypeScript project.
-   **Styling & Configuration**:
    -   Configured `tailwind.config.js` with a custom color palette for the Sudoku theme (`bg-main`, `text-primary`, `grid-thick`, etc.).
    -   Created `index.css` with base styles, system fonts, and an accessible `.interact-target` utility class.
-   **State Management**:
    -   Implemented game state logic using Zustand in `useGameStore.ts`.
    -   Includes state for the grid, selections, history (undo/redo), and difficulty.
    -   Features actions for `newGame`, `selectCell`, `setCellValue`, `undo`, `redo`, and `checkErrors`.
-   **Core UI Components**:
    -   `Cell.tsx`: Renders an individual Sudoku cell with dynamic styles for different states (given, selected, related, error).
    -   `Board.tsx`: Renders the 9x9 game board, handling cell layout and the distinct 3x3 box borders.
    -   `Controls.tsx`: Provides the user interface for number input and game actions (Undo, Redo, Clear, Hint).
-   **Application Assembly**:
    -   `App.tsx`: Assembles all components into a responsive, desktop-first application layout, including a header, main content area, and footer.
