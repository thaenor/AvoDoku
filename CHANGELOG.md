# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
