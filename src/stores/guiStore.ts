import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GuiStore } from '../types';

// Constants from original codebase
const MAX_CELL_NUM = 15;
const MIN_CELL_NUM = 3;
const TAPE_BREAK_POINT = 1168;
const DESKTOP_BREAK_POINT = 780;
const IPAD_BREAK_POINT = 600;
const BIG_PHONE_BREAK_POINT = 450;

// Head constants
const INIT_HEAD_WIDTH = 40;
const INIT_HEAD_LEFT_OFFSET = 20;

interface HeadPosition {
  x: number;
  width: number;
  leftOffset: number;
}

interface ResponsiveInfo {
  screenSize: number;
  cellNum: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Extended state for internal store management
interface InternalGuiState {
  // Screen and layout
  screenSize: number;
  cellNum: number;
  rightBoundary: number;
  
  // Head positioning and sizing
  headX: number;
  headWidth: number;
  headLeftOffset: number;
  
  // Dialog and UI state
  saveMachineResponseOpen: boolean;
  anythingNewWithMachine: boolean;
  dialogOpen: boolean;
  errorMessage: string;
  trialDrawerOpen: boolean;
  
  // Responsive breakpoints
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Initial GUI state
const initialGuiState: InternalGuiState = {
  // Screen and layout
  screenSize: 0,
  cellNum: MAX_CELL_NUM,
  rightBoundary: 0,
  
  // Head positioning and sizing
  headX: 0,
  headWidth: INIT_HEAD_WIDTH,
  headLeftOffset: INIT_HEAD_LEFT_OFFSET,
  
  // Dialog and UI state
  saveMachineResponseOpen: false,
  anythingNewWithMachine: false,
  dialogOpen: false,
  errorMessage: "",
  trialDrawerOpen: false,
  
  // Responsive breakpoints
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

export const useGuiStore = create<GuiStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialGuiState,

      // Screen size and responsive handling
      resizeScreenAndTape: (screenWidth: number): void => {
        set((state) => {
          state.screenSize = screenWidth;
          
          // Determine device type
          state.isMobile = screenWidth < BIG_PHONE_BREAK_POINT;
          state.isTablet = screenWidth >= BIG_PHONE_BREAK_POINT && screenWidth < DESKTOP_BREAK_POINT;
          state.isDesktop = screenWidth >= DESKTOP_BREAK_POINT;
          
          // Calculate cell number based on screen size
          if (screenWidth < IPAD_BREAK_POINT) {
            state.cellNum = MIN_CELL_NUM;
          } else if (screenWidth < TAPE_BREAK_POINT) {
            // Linear interpolation between MIN and MAX based on screen width
            const ratio = (screenWidth - IPAD_BREAK_POINT) / (TAPE_BREAK_POINT - IPAD_BREAK_POINT);
            state.cellNum = Math.floor(MIN_CELL_NUM + ratio * (MAX_CELL_NUM - MIN_CELL_NUM));
          } else {
            state.cellNum = MAX_CELL_NUM;
          }
          
          // Calculate tape boundaries and head position
          const cellWidth = screenWidth / state.cellNum;
          state.rightBoundary = screenWidth - cellWidth;
          
          // Center the head initially
          state.headX = (screenWidth / 2) - (state.headWidth / 2);
        });
      },

      // Head width and position management
      adjustHeadWidth: (text: string): void => {
        set((state) => {
          if (text && text.length > 0) {
            // Calculate width based on text length
            const baseWidth = INIT_HEAD_WIDTH;
            const charWidth = 12; // Approximate character width
            const calculatedWidth = Math.max(baseWidth, text.length * charWidth + 20);
            
            state.headWidth = Math.min(calculatedWidth, state.screenSize / 3); // Max 1/3 of screen
            state.headLeftOffset = Math.max(10, (state.headWidth - baseWidth) / 2);
          } else {
            state.headWidth = INIT_HEAD_WIDTH;
            state.headLeftOffset = INIT_HEAD_LEFT_OFFSET;
          }
        });
      },

      moveHead: (direction: 'left' | 'right'): void => {
        set((state) => {
          const cellWidth = state.screenSize / state.cellNum;
          
          if (direction === 'left') {
            state.headX = Math.max(0, state.headX - cellWidth);
          } else if (direction === 'right') {
            state.headX = Math.min(state.rightBoundary, state.headX + cellWidth);
          }
        });
      },

      // Dialog management
      openSaveMachineDialog: (isSuccessful: boolean = true): void => {
        set((state) => {
          state.saveMachineResponseOpen = true;
          state.anythingNewWithMachine = isSuccessful;
        });
      },

      closeSaveMachineDialog: (): void => {
        set((state) => {
          state.saveMachineResponseOpen = false;
        });
      },

      openErrorDialog: (message: string): void => {
        set((state) => {
          state.dialogOpen = true;
          state.errorMessage = message;
        });
      },

      closeErrorDialog: (): void => {
        set((state) => {
          state.dialogOpen = false;
          state.errorMessage = "";
        });
      },

      // Trial drawer management
      openTrialDrawer: (): void => {
        set((state) => {
          state.trialDrawerOpen = true;
        });
      },

      closeTrialDrawer: (): void => {
        set((state) => {
          state.trialDrawerOpen = false;
        });
      },

      toggleTrialDrawer: (): void => {
        set((state) => {
          state.trialDrawerOpen = !state.trialDrawerOpen;
        });
      },

      // Utility functions
      getCellWidth: (): number => {
        const state = get();
        return state.screenSize / state.cellNum;
      },

      getHeadPosition: (): HeadPosition => {
        const state = get();
        return {
          x: state.headX,
          width: state.headWidth,
          leftOffset: state.headLeftOffset,
        };
      },

      getResponsiveInfo: (): ResponsiveInfo => {
        const state = get();
        return {
          screenSize: state.screenSize,
          cellNum: state.cellNum,
          isMobile: state.isMobile,
          isTablet: state.isTablet,
          isDesktop: state.isDesktop,
        };
      },

      // Initialize GUI with current window dimensions
      initialize: (): void => {
        set((state) => {
          const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
          Object.assign(state, initialGuiState);
        });
        
        // Trigger resize calculation
        if (typeof window !== 'undefined') {
          get().resizeScreenAndTape(window.innerWidth);
        }
      },

      // Reset to initial state
      reset: (): void => {
        set((state) => {
          Object.assign(state, initialGuiState);
        });
      },
    }))
  )
);

// Set up window resize listener
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    useGuiStore.getState().resizeScreenAndTape(window.innerWidth);
  });
}

export default useGuiStore;