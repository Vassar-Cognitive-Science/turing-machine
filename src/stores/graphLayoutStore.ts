import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

export interface NodePosition {
  x: number;
  y: number;
}

export interface EdgeLayout {
  id: string;
  sourceHandle?: string;
  targetHandle?: string;
  controlPoint?: { x: number; y: number };
}

export interface GraphLayoutState {
  nodePositions: Record<string, NodePosition>;
  edgeLayouts: Record<string, EdgeLayout>;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface GraphLayoutActions {
  // Node position management
  updateNodePosition: (nodeId: string, position: NodePosition) => void;
  updateNodePositions: (positions: Record<string, NodePosition>) => void;
  getNodePosition: (nodeId: string) => NodePosition | undefined;
  removeNodePosition: (nodeId: string) => void;
  
  // Edge layout management
  updateEdgeLayout: (edgeId: string, layout: Partial<EdgeLayout>) => void;
  getEdgeLayout: (edgeId: string) => EdgeLayout | undefined;
  removeEdgeLayout: (edgeId: string) => void;
  
  // Viewport management
  updateViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  
  // Bulk operations
  clearLayout: () => void;
  exportLayout: () => GraphLayoutState;
  importLayout: (layout: Partial<GraphLayoutState>) => void;
}

export type GraphLayoutStore = GraphLayoutState & GraphLayoutActions;

const initialState: GraphLayoutState = {
  nodePositions: {},
  edgeLayouts: {},
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
};

export const useGraphLayoutStore = create<GraphLayoutStore>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // Node position management
        updateNodePosition: (nodeId: string, position: NodePosition) => {
          set((state) => {
            state.nodePositions[nodeId] = position;
          });
        },

        updateNodePositions: (positions: Record<string, NodePosition>) => {
          set((state) => {
            Object.entries(positions).forEach(([nodeId, position]) => {
              state.nodePositions[nodeId] = position;
            });
          });
        },

        getNodePosition: (nodeId: string) => {
          return get().nodePositions[nodeId];
        },

        removeNodePosition: (nodeId: string) => {
          set((state) => {
            delete state.nodePositions[nodeId];
          });
        },

        // Edge layout management
        updateEdgeLayout: (edgeId: string, layout: Partial<EdgeLayout>) => {
          set((state) => {
            const existing = state.edgeLayouts[edgeId] || { id: edgeId };
            state.edgeLayouts[edgeId] = { ...existing, ...layout };
          });
        },

        getEdgeLayout: (edgeId: string) => {
          return get().edgeLayouts[edgeId];
        },

        removeEdgeLayout: (edgeId: string) => {
          set((state) => {
            delete state.edgeLayouts[edgeId];
          });
        },

        // Viewport management
        updateViewport: (viewport: { x: number; y: number; zoom: number }) => {
          set((state) => {
            state.viewport = viewport;
          });
        },

        // Bulk operations
        clearLayout: () => {
          set((state) => {
            state.nodePositions = {};
            state.edgeLayouts = {};
            state.viewport = { x: 0, y: 0, zoom: 1 };
          });
        },

        exportLayout: () => {
          const state = get();
          return {
            nodePositions: state.nodePositions,
            edgeLayouts: state.edgeLayouts,
            viewport: state.viewport,
          };
        },

        importLayout: (layout: Partial<GraphLayoutState>) => {
          set((state) => {
            if (layout.nodePositions) {
              state.nodePositions = { ...state.nodePositions, ...layout.nodePositions };
            }
            if (layout.edgeLayouts) {
              state.edgeLayouts = { ...state.edgeLayouts, ...layout.edgeLayouts };
            }
            if (layout.viewport) {
              state.viewport = layout.viewport;
            }
          });
        },
      }))
    ),
    {
      name: 'graph-layout-store',
      // Only persist essential layout data
      partialize: (state) => ({
        nodePositions: state.nodePositions,
        edgeLayouts: state.edgeLayouts,
        viewport: state.viewport,
      }),
    }
  )
);

export default useGraphLayoutStore;