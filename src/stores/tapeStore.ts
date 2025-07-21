import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import type { TapeCell, TapeStore, VisibleCell } from '../types';

// Constants from original codebase
const BLANK = "∅"; // Blank symbol
const CELL_ID_PREFIX = "TAPE-CELL ";

// Utility function to capitalize alphabet characters and trim whitespace
const capitalizeAlphabet = (value: string): string => {
  if (!value) return value;
  return value.trim().replace(/[a-z]/g, (char) => char.toUpperCase());
};

// Utility functions
const standardizeCellId = (id: string | number | null): string | null => {
  if (id == null) return null;
  if (id.toString().startsWith(CELL_ID_PREFIX)) return id.toString();
  return CELL_ID_PREFIX + id;
};

const generateCellId = (): string => {
  return standardizeCellId(crypto.randomUUID())!;
};

// Extended state for internal store management
interface InternalTapeState {
  // Tape structure (linked list approach)
  anchorCell: number; // For mapping virtual cells to presentation
  tapeHead: string | null; // First cell ID
  tapeTail: string | null; // Last cell ID
  tapePointer: string | null; // Current head position cell ID
  tapeCellsById: string[]; // Array of cell IDs in order
  
  // Head state
  tapeInternalState: string; // Current state of the Turing machine head
  highlightedCellOrder: number;
  
  // Cell data stored as dynamic properties
  [key: string]: any; // For cell data
}

// Initial tape state
const initialTapeState: InternalTapeState = {
  // Tape structure (linked list approach)
  anchorCell: 0, // For mapping virtual cells to presentation
  tapeHead: null, // First cell ID
  tapeTail: null, // Last cell ID
  tapePointer: null, // Current head position cell ID
  tapeCellsById: [], // Array of cell IDs in order
  
  // Head state
  tapeInternalState: "START", // Current state of the Turing machine head
  highlightedCellOrder: -1,
  
  // Cell data stored as { [cellId]: { val, prev, next, highlight } }
  // This will be dynamically added to the store
};

export const useTapeStore = create<TapeStore>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
      ...initialTapeState,

      // Tape initialization
      initializeTape: (controlled: boolean = false): void => {
        set((state) => {
          // Clear existing tape
          state.tapeCellsById.forEach(cellId => {
            delete (state as any)[cellId];
          });

          // Create initial tape with multiple cells to represent infinite tape
          const numInitialCells = 15; // Show enough cells to represent infinite tape
          const cellIds: string[] = [];
          
          // Generate cell IDs and create cells
          for (let i = 0; i < numInitialCells; i++) {
            const cellId = generateCellId();
            cellIds.push(cellId);
            
            (state as any)[cellId] = {
              val: BLANK,
              prev: i > 0 ? cellIds[i - 1] : null,
              next: null, // Will be set in next iteration
              highlight: false,
            };
            
            // Set next pointer for previous cell
            if (i > 0) {
              (state as any)[cellIds[i - 1]].next = cellId;
            }
          }

          // Set up tape structure
          state.tapeHead = cellIds[0];
          state.tapeTail = cellIds[cellIds.length - 1];
          state.tapePointer = cellIds[Math.floor(numInitialCells / 2)]; // Start in middle
          state.tapeCellsById = cellIds;
          state.anchorCell = 0;
          state.highlightedCellOrder = -1;

          if (!controlled) {
            state.tapeInternalState = "START";
          }
        });
      },

      // Head movement
      moveHeadLeft: (): void => {
        set((state) => {
          if (state.tapePointer) {
            const currentCell = (state as any)[state.tapePointer];
            if (currentCell && currentCell.prev) {
              state.tapePointer = currentCell.prev;
            } else {
              // Need to expand tape to the left - inline expansion logic
              const newCellId = generateCellId();
              const currentHeadId = state.tapeHead;
              
              // Create new cell
              (state as any)[newCellId] = {
                val: BLANK,
                prev: null,
                next: currentHeadId,
                highlight: false,
              };

              // Update old head cell
              if ((state as any)[currentHeadId!]) {
                (state as any)[currentHeadId!].prev = newCellId;
              }

              // Update tape structure
              state.tapeHead = newCellId;
              state.tapeCellsById.unshift(newCellId);
              
              // Now move head to the new cell
              state.tapePointer = newCellId;
            }
          }
        });
      },

      moveHeadRight: (): void => {
        set((state) => {
          if (state.tapePointer) {
            const currentCell = (state as any)[state.tapePointer];
            if (currentCell && currentCell.next) {
              state.tapePointer = currentCell.next;
            } else {
              // Need to expand tape to the right - inline expansion logic
              const newCellId = generateCellId();
              const currentTailId = state.tapeTail;
              
              // Create new cell
              (state as any)[newCellId] = {
                val: BLANK,
                prev: currentTailId,
                next: null,
                highlight: false,
              };

              // Update old tail cell
              if ((state as any)[currentTailId!]) {
                (state as any)[currentTailId!].next = newCellId;
              }

              // Update tape structure
              state.tapeTail = newCellId;
              state.tapeCellsById.push(newCellId);
              
              // Now move head to the new cell
              state.tapePointer = newCellId;
            }
          }
        });
      },

      // Tape expansion
      expandTapeLeft: (): void => {
        set((state) => {
          const newCellId = generateCellId();
          const currentHeadId = state.tapeHead;
          
          // Create new cell
          (state as any)[newCellId] = {
            val: BLANK,
            prev: null,
            next: currentHeadId,
            highlight: false,
          };

          // Update old head cell
          if ((state as any)[currentHeadId!]) {
            (state as any)[currentHeadId!].prev = newCellId;
          }

          // Update tape structure
          state.tapeHead = newCellId;
          state.tapeCellsById.unshift(newCellId);
        });
      },

      expandTapeRight: (): void => {
        set((state) => {
          const newCellId = generateCellId();
          const currentTailId = state.tapeTail;
          
          // Create new cell
          (state as any)[newCellId] = {
            val: BLANK,
            prev: currentTailId,
            next: null,
            highlight: false,
          };

          // Update old tail cell
          if ((state as any)[currentTailId!]) {
            (state as any)[currentTailId!].next = newCellId;
          }

          // Update tape structure
          state.tapeTail = newCellId;
          state.tapeCellsById.push(newCellId);
        });
      },

      // Read/Write operations
      readCurrentCell: (): string => {
        const state = get() as any;
        const currentCell = state[state.tapePointer];
        const cellValue = currentCell ? currentCell.val : BLANK;
        // Return # for blank cells (# is the only blank symbol)
        return cellValue === BLANK ? "#" : cellValue;
      },

      writeToCurrentCell: (value: string): void => {
        set((state) => {
          if (state.tapePointer) {
            const currentCell = (state as any)[state.tapePointer];
            if (currentCell) {
              // If # is written, set cell to blank (# is the only blank symbol)
              // Capitalize alphabet characters automatically
              const processedValue = value === "#" ? BLANK : capitalizeAlphabet(value || "#");
              currentCell.val = processedValue;
            }
          }
        });
      },

      writeToCell: (cellId: string, value: string): void => {
        set((state) => {
          // Clear rule highlighting when user manually edits tape
          const { useMachineStore } = require('./index');
          useMachineStore.getState().setCurrentRule(null);
          
          const cell = (state as any)[cellId];
          if (cell) {
            // If # is written, set cell to blank (# is the only blank symbol)
            // Capitalize alphabet characters automatically
            const processedValue = value === "#" ? BLANK : capitalizeAlphabet(value || "#");
            cell.val = processedValue;
          }
        });
      },

      // Internal state management
      setInternalState: (newState: string): void => {
        set((state) => {
          // Don't clear rule highlighting during machine execution - only clear on manual user changes
          // The machine execution will manage currentRule highlighting appropriately
          
          // Capitalize alphabet characters in state names
          state.tapeInternalState = capitalizeAlphabet(newState || "START");
        });
      },

      // Manual state change (for user interactions - clears highlighting)
      setManualState: (newState: string): void => {
        set((state) => {
          // Clear rule highlighting when user manually changes state
          const { useMachineStore } = require('./index');
          useMachineStore.getState().setCurrentRule(null);
          
          // Capitalize alphabet characters in state names
          state.tapeInternalState = capitalizeAlphabet(newState || "START");
        });
      },

      // Cell highlighting
      highlightCell: (cellId: string): void => {
        set((state) => {
          // Clear all highlights first
          state.tapeCellsById.forEach(id => {
            if ((state as any)[id]) {
              (state as any)[id].highlight = false;
            }
          });

          // Set new highlight
          if (cellId && (state as any)[cellId]) {
            (state as any)[cellId].highlight = true;
          }
        });
      },

      clearHighlights: (): void => {
        set((state) => {
          state.tapeCellsById.forEach(id => {
            if ((state as any)[id]) {
              (state as any)[id].highlight = false;
            }
          });
          state.highlightedCellOrder = -1;
        });
      },

      // Tape navigation for display
      moveTapeLeft: (): void => {
        set((state) => {
          if (state.anchorCell <= 0) {
            // Expand tape to the left when scrolling past the beginning
            const newCellId = generateCellId();
            const currentHeadId = state.tapeHead;
            
            // Create new cell
            (state as any)[newCellId] = {
              val: BLANK,
              prev: null,
              next: currentHeadId,
              highlight: false,
            };

            // Update old head cell
            if ((state as any)[currentHeadId!]) {
              (state as any)[currentHeadId!].prev = newCellId;
            }

            // Update tape structure
            state.tapeHead = newCellId;
            state.tapeCellsById.unshift(newCellId);
            
            // After adding a cell at the beginning, anchorCell stays at 0
            // This allows us to see the newly added cell
          } else {
            state.anchorCell = state.anchorCell - 1;
          }
        });
      },

      moveTapeRight: (): void => {
        set((state) => {
          // Simply increment anchor cell - getVisibleCells will handle expansion
          state.anchorCell = state.anchorCell + 1;
        });
      },

      // Utility functions
      getCell: (cellId: string): TapeCell | null => {
        const state = get() as any;
        return state[standardizeCellId(cellId)!] || null;
      },

      getCurrentCell: (): TapeCell | null => {
        const state = get() as any;
        return state[state.tapePointer] || null;
      },

      getTapeAsString: (): string => {
        const state = get() as any;
        return state.tapeCellsById
          .map((cellId: string) => state[cellId]?.val || BLANK)
          .join('');
      },

      // Ensure we have enough cells for the visible window
      ensureVisibleCells: (count: number = 15): void => {
        set((state) => {
          const startIndex = Math.max(0, state.anchorCell);
          const neededCells = startIndex + count;
          
          while (state.tapeCellsById.length < neededCells) {
            // Expand tape to the right to ensure we have enough cells
            const newCellId = generateCellId();
            const currentTailId = state.tapeTail;
            
            // Create new cell
            (state as any)[newCellId] = {
              val: BLANK,
              prev: currentTailId,
              next: null,
              highlight: false,
            };

            // Update old tail cell
            if ((state as any)[currentTailId!]) {
              (state as any)[currentTailId!].next = newCellId;
            }

            // Update tape structure
            state.tapeTail = newCellId;
            state.tapeCellsById.push(newCellId);
          }
        });
      },

      getVisibleCells: (count: number = 15): VisibleCell[] => {
        // Ensure we have enough cells first
        get().ensureVisibleCells(count);
        
        const state = get() as any;
        const startIndex = Math.max(0, state.anchorCell);
        
        // Always return exactly `count` cells
        return state.tapeCellsById
          .slice(startIndex, startIndex + count)
          .map((cellId: string) => ({
            id: cellId,
            ...state[cellId],
            isHead: cellId === state.tapePointer,
          }));
      },

      getCurrentHeadPosition: (): number => {
        const state = get();
        return state.tapeCellsById.indexOf(state.tapePointer!);
      },

      // Fill tape with a string
      fillTape: (content: string): void => {
        set((state) => {
          // Clear rule highlighting when user fills tape (except when done programmatically during reset)
          // We can detect manual vs programmatic by checking if the machine is currently being reset
          const { useMachineStore } = require('./index');
          const machineState = useMachineStore.getState();
          // Only clear if machine is not currently running (manual tape fill)
          if (!machineState.isRunning) {
            machineState.setCurrentRule(null);
          }
          
          // Clear existing tape
          state.tapeCellsById.forEach(cellId => {
            delete (state as any)[cellId];
          });

          // Create expandable tape with initial size to accommodate content plus buffer
          const minTapeSize = 15;
          const contentLength = content ? content.length : 0;
          const bufferSize = 5; // Buffer on each side for expansion
          const initialTapeSize = Math.max(minTapeSize, contentLength + 2 * bufferSize);
          
          const cellIds: string[] = [];
          
          // Calculate where to place content (center it in the tape)
          const contentStartPos = Math.floor((initialTapeSize - contentLength) / 2);
          
          // Generate cell IDs and create cells
          for (let i = 0; i < initialTapeSize; i++) {
            const cellId = generateCellId();
            cellIds.push(cellId);
            
            // Determine cell value
            let cellValue = BLANK; // Default to blank
            if (content && i >= contentStartPos && i < contentStartPos + contentLength) {
              // This is a content cell
              const contentIndex = i - contentStartPos;
              const rawValue = content[contentIndex] === ' ' || content[contentIndex] === '#' ? BLANK : content[contentIndex];
              cellValue = rawValue === BLANK ? BLANK : capitalizeAlphabet(rawValue);
            }
            
            (state as any)[cellId] = {
              val: cellValue,
              prev: i > 0 ? cellIds[i - 1] : null,
              next: null, // Will be set in next iteration
              highlight: false,
            };

            // Set next pointer for previous cell
            if (i > 0) {
              (state as any)[cellIds[i - 1]].next = cellId;
            }
          }

          // Set up tape structure
          state.tapeHead = cellIds[0];
          state.tapeTail = cellIds[cellIds.length - 1];
          state.tapeCellsById = cellIds;
          
          // Position head at the start of content (or center if no content)
          const headPosition = content ? contentStartPos : Math.floor(initialTapeSize / 2);
          state.tapePointer = cellIds[headPosition];
          
          state.anchorCell = 0;
          state.highlightedCellOrder = -1;
        });
      },

      // Set head position directly to a specific cell
      setHeadPosition: (cellId: string): void => {
        set((state) => {
          // Verify the cell exists in the tape
          if (state.tapeCellsById.includes(cellId)) {
            state.tapePointer = cellId;
          }
        });
      },

      // Set head position by absolute index (0-14 for 15-cell tape)
      setHeadPositionByIndex: (index: number): void => {
        set((state) => {
          if (index >= 0 && index < state.tapeCellsById.length) {
            state.tapePointer = state.tapeCellsById[index];
          }
        });
      },

      // Restore exact tape state (for undo/redo and load operations)
      restoreExactTapeState: (tapeContent: string, headPosition: number, anchorCell: number = 0): void => {
        set((state) => {
          // Clear existing tape
          state.tapeCellsById.forEach(cellId => {
            delete (state as any)[cellId];
          });

          // Create tape with exact size to match the saved content
          const numCells = Math.max(15, tapeContent.length); // At least 15 cells, or content length
          const cellIds: string[] = [];
          
          // Generate cell IDs and set content
          for (let i = 0; i < numCells; i++) {
            const cellId = generateCellId();
            cellIds.push(cellId);
            
            // Set cell value from tapeContent or blank
            let cellValue = BLANK;
            if (tapeContent && i < tapeContent.length) {
              cellValue = tapeContent[i] === '#' || tapeContent[i] === ' ' ? BLANK : tapeContent[i];
            }
            
            (state as any)[cellId] = {
              val: cellValue,
              prev: i > 0 ? cellIds[i - 1] : null,
              next: null, // Will be set in next iteration
              highlight: false,
            };

            // Set next pointer for previous cell
            if (i > 0) {
              (state as any)[cellIds[i - 1]].next = cellId;
            }
          }

          // Update tape structure
          state.tapeHead = cellIds[0];
          state.tapeTail = cellIds[cellIds.length - 1];
          state.tapeCellsById = cellIds;
          state.anchorCell = anchorCell;
          
          // Set head position by absolute index
          if (headPosition >= 0 && headPosition < cellIds.length) {
            state.tapePointer = cellIds[headPosition];
          } else {
            // Default to center if invalid position
            state.tapePointer = cellIds[Math.floor(numCells / 2)];
          }
          
          state.highlightedCellOrder = -1;
        });
      },

      // Check if tape is empty
      isTapeEmpty: (): boolean => {
        const state = get() as any;
        return state.tapeHead === state.tapeTail && 
               state.tapeCellsById.length <= 1 &&
               (!state[state.tapeHead] || state[state.tapeHead].val === BLANK);
      },
    }))
    ),
    {
      name: 'turing-tape-store',
      version: 2, // Version 2 with UUID-based cell IDs
      partialize: (state) => {
        // Convert tape content to a simple string for persistence
        const tapeContent = state.tapeCellsById
          .map((cellId: string) => {
            const cell = (state as any)[cellId];
            return cell ? cell.val : BLANK;
          })
          .join('');
        
        // Save head position relative to content, not absolute position
        const headPosition = state.tapeCellsById.indexOf(state.tapePointer!);
        
        // Extract just the meaningful content (remove leading/trailing blanks)
        const meaningfulContent = tapeContent.replace(/^∅+|∅+$/g, '');
        
        return {
          // Persist simplified tape representation
          tapeContent: meaningfulContent.replace(new RegExp(BLANK, 'g'), '#'), // Convert blanks to # for storage
          headPosition: Math.max(0, headPosition),
          tapeInternalState: state.tapeInternalState,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && (state as any).tapeContent) {
          // Restore tape from persisted content
          const content = (state as any).tapeContent;
          const headPos = (state as any).headPosition || 0;
          
          // Use fillTape to restore the structure - this is the simplest approach
          state.fillTape(content);
          
          // Set head position
          if (headPos < state.tapeCellsById.length) {
            state.tapePointer = state.tapeCellsById[headPos];
          }
        }
      },
    }
  )
);

export default useTapeStore;