import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
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
  return standardizeCellId(Date.now() + "_" + Math.random().toString(36).substr(2, 9))!;
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
          // Clear existing tape
          state.tapeCellsById.forEach(cellId => {
            delete (state as any)[cellId];
          });

          if (!content || content.length === 0) {
            // Create empty tape with multiple blank cells to show infinite tape
            // Initialize tape directly instead of calling get().initializeTape()
            const numInitialCells = 15;
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
            return;
          }

          // Add padding cells before and after content to show infinite tape
          const paddingBefore = 5;
          const paddingAfter = 5;
          const cellIds: string[] = [];
          const contentArray = content.split('');
          const totalCells = paddingBefore + contentArray.length + paddingAfter;

          // Create all cells (padding + content + padding)
          for (let i = 0; i < totalCells; i++) {
            const cellId = generateCellId();
            cellIds.push(cellId);
            
            let cellValue = BLANK;
            if (i >= paddingBefore && i < paddingBefore + contentArray.length) {
              // This is a content cell
              const contentIndex = i - paddingBefore;
              const rawValue = contentArray[contentIndex] === ' ' ? "#" : contentArray[contentIndex];
              // Capitalize alphabet characters in tape content, use # for blank
              cellValue = rawValue === "#" ? BLANK : capitalizeAlphabet(rawValue);
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
          state.tapeCellsById = cellIds;
          state.tapeHead = cellIds[0];
          state.tapeTail = cellIds[cellIds.length - 1];
          state.tapePointer = cellIds[paddingBefore]; // Start at beginning of content
          state.anchorCell = 0;
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

      // Check if tape is empty
      isTapeEmpty: (): boolean => {
        const state = get() as any;
        return state.tapeHead === state.tapeTail && 
               state.tapeCellsById.length <= 1 &&
               (!state[state.tapeHead] || state[state.tapeHead].val === BLANK);
      },
    }))
  )
);

export default useTapeStore;