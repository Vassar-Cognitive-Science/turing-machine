# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based Turing Machine simulator built with **modern React 18**, **Zustand** for state management, and **Material-UI v5**. The application allows users to create, edit, and run Turing machines with visual tape representation and state transitions.

**⚡ Recently Modernized**: This project has been completely migrated from Redux + Webpack 3 to Zustand + esbuild with full Turing machine execution logic implemented.

## Development Commands

- `npm run dev` - Start development server with esbuild hot reload
- `npm start` - Start production server  
- `npm run build` - Build for production using esbuild (sub-second builds!)
- `npm run build:watch` - Build with watch mode
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run type-check` - TypeScript type checking

## Architecture

### Modern React Architecture
- **Entry Point**: `src/client/index.js` with React 18 createRoot
- **State Management**: Zustand stores with immer middleware
- **Routing**: React Router v6 with modern routing
- **UI Framework**: Material-UI v5 with emotion styling
- **Build System**: esbuild for ultra-fast compilation

### Zustand Store Structure
The application uses multiple focused Zustand stores:
- **Machine Store** (`src/stores/machineStore.js`): Rules, execution, stepping logic
- **Tape Store** (`src/stores/tapeStore.js`): Virtual tape cells, head position, read/write operations
- **GUI Store** (`src/stores/guiStore.js`): UI state, responsive layout, dialogs
- **Trial Store** (`src/stores/trialStore.js`): Test cases, trial execution, results

### Component Organization
- `src/common/components/AppModern.js` - Main application component using hooks
- `src/stores/` - Zustand stores with TypeScript support
- `build/` - esbuild configuration and build scripts
- Modern React patterns: hooks, functional components, Material-UI v5

### Key Stores and Hooks
- `useMachineStore()` - Machine state and rule management
- `useTapeStore()` - Tape operations and head movement
- `useGuiStore()` - UI state and responsive behavior
- `useTrialStore()` - Test case management
- `useMachineExecution()` - Combined hook for machine execution
- `useTapeOperations()` - Combined hook for tape interactions

### Server-Side Structure
- **Server Entry**: `src/server/index.js` → `src/server/server.js`
- **Framework**: Express.js with Babel transpilation
- **Static Files**: Serves from `public/` directory

### Build System
- **Webpack**: Separate configs for development and production
- **Babel**: ES6+ transpilation with React presets
- **Development**: Uses webpack-dev-middleware and hot-middleware

## Key Features

### Undo/Redo System
The application implements a comprehensive undo/redo system in the root reducer that tracks:
- Rule table modifications
- Tape state changes
- Machine state transitions

### Animation System
- Configurable animation speed
- Step-by-step execution visualization
- Tape head movement animation

### Trial System
- Create and manage test cases
- Edit mode for trial creation
- Batch trial execution
- Expected vs actual output comparison

## Development Notes

### State Management Patterns
- Uses immutable state updates
- Implements side effect cleanup in reducers
- Tracks changes separately for normal vs trial edit modes

### Component Patterns
- Container/Component separation
- React-DnD for drag-and-drop functionality
- Material-UI theming and responsive design

### Testing
- Jest test framework configured
- Babel integration for ES6+ test files