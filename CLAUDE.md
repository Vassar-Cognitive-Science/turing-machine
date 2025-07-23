# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based Turing Machine simulator built with **React 18**, **Zustand** for state management, **Material-UI v7**, and **esbuild** for ultra-fast builds. The application allows users to create, edit, and run Turing machines with visual tape representation and state transitions.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload (runs frontend + server concurrently)
- `npm run build` - Build for production using esbuild
- `npm test` - Run Jest tests with ES modules support
- `npm run type-check` - TypeScript type checking (also aliased as `npm run lint`)

### Additional Development Commands
- `npm run dev:frontend` - Start only the frontend build in watch mode
- `npm run dev:server` - Start only the development server
- `npm run build:watch` - Build with watch mode
- `npm run test:watch` - Run tests in watch mode
- `npm run type-check:watch` - TypeScript checking in watch mode

### Database Commands (MongoDB via Docker)
- `npm run db:start` - Start MongoDB container
- `npm run db:stop` - Stop MongoDB container
- `npm run db:reset` - Reset database (removes volumes)
- `npm run db:logs` - View database logs

### Production/Deployment
- `npm start` - Start production server
- `npm run deploy:prod` - Build and deploy with PM2
- Various `pm2:*` commands for process management

## Architecture

### Modern React + TypeScript Architecture
- **Entry Point**: `src/client/index.tsx` with React 18 createRoot and MUI theming
- **Main App**: `src/common/components/AppModern.tsx` - Central component coordinating all functionality
- **State Management**: Zustand stores with immer and persistence middleware
- **UI Framework**: Material-UI v5 with custom theme and larger font sizes
- **Build System**: esbuild with TypeScript support for sub-second builds

### Zustand Store Architecture
The application uses multiple focused Zustand stores with TypeScript:

- **Machine Store** (`src/stores/machineStore.ts`): Rule management, validation, execution state
- **Tape Store** (`src/stores/tapeStore.ts`): Virtual tape implementation, head position, cell operations  
- **GUI Store** (`src/stores/guiStore.ts`): UI state management, responsive layout
- **Trial Store** (`src/stores/trialStore.ts`): Test case creation, execution, results
- **Graph Layout Store** (`src/stores/graphLayoutStore.ts`): React Flow graph layout state

### Combined Operation Hooks
The `src/stores/index.ts` file provides higher-level hooks that combine multiple stores:

- `useMachineExecution()` - Machine running, stepping, stopping, reset logic
- `useTapeOperations()` - Tape reading, writing, head movement operations
- `useTrialOperations()` - Test case creation and batch execution
- `useUndoRedo()` - History-based undo/redo functionality

### Component Structure
- **Machine Components**: `src/common/components/machine/` (controls, rules table, tape display)
- **Trial Components**: `src/common/components/trials/` (drawer, editor, details)
- **Rules Components**: `src/common/components/machine/rules/` (React Flow graph, rule editing)

### Build System Details
- **esbuild Configuration**: `build/esbuild.config.js` with separate dev/prod configurations
- **Build Script**: `build/build.js` supports watch mode and production optimization
- **TypeScript**: Configured with path aliases (`@/*` for `src/*`) in `tsconfig.json`
- **Output**: Single bundle to `public/static/bundle.js`

### Server Architecture  
- **Express Server**: `src/server/server.js` with API endpoints for saving/loading machine states
- **MongoDB Integration**: State persistence with Docker-based development database
- **API Endpoints**: `/api/save`, `/api/state/:id`, `/api/health`

## Key Implementation Details

### Machine Execution Logic
The machine execution is implemented in `useMachineExecution()` hook with:
- Step-by-step execution with rule matching and state transitions
- Animation support with configurable speed
- Infinite loop protection (10,000 step limit)
- History tracking for undo/redo functionality
- Turbo mode for fast execution without animation

### State Persistence 
- **Zustand Persistence**: Automatic local storage persistence for stores
- **Server State Sharing**: Full machine state serialization (v2.0 format) with shareable URLs
- **State Loading**: URL-based state loading with fallback to preloaded state

### Testing Configuration
- **Jest**: Configured for ES modules with `NODE_OPTIONS="--experimental-vm-modules"`
- **Test Files**: Located in `test/` directory with `.test.js` extension
- **Integration Tests**: Database integration tests with Docker container management

### React Flow Integration
The rules visualization uses React Flow (`@xyflow/react`) with:
- Custom node and edge components for state transitions
- Automatic layout using dagre algorithm
- Interactive graph editing and state renaming