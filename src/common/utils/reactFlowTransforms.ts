import type { Node, Edge } from '@xyflow/react';
import type { Rule } from '../../types';
import type { StateNodeData } from '../components/machine/rules/StateNode';
import type { TransitionEdgeData } from '../components/machine/rules/TransitionEdge';

// Available handle positions for edge connections
const HANDLE_POSITIONS = [
  'top',
  'top-right', 
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
  'top-left'
] as const;

type HandlePosition = typeof HANDLE_POSITIONS[number];

// Type aliases for React Flow nodes and edges
export type ReactFlowNode = Node & { data: StateNodeData };
export type ReactFlowEdge = Edge & { data: TransitionEdgeData };

/**
 * Extract unique states from rules
 */
export function extractStatesFromRules(rules: Rule[]): string[] {
  const states = new Set<string>();
  
  rules.forEach(rule => {
    if (rule.in_state) states.add(rule.in_state);
    if (rule.new_state) states.add(rule.new_state);
  });
  
  return Array.from(states).sort();
}

/**
 * Determine if a state is a start state
 */
export function isStartState(state: string): boolean {
  return state.toUpperCase() === 'START';
}

/**
 * Determine if a state is a halt state
 */
export function isHaltState(state: string): boolean {
  return state.toUpperCase() === 'HALT';
}

/**
 * Convert rules to React Flow nodes and edges with distributed connection points
 */
export function transformRulesToReactFlow(
  rules: Rule[],
  existingNodes: Node[] = []
): { nodes: Node[]; edges: Edge[] } {
  const states = extractStatesFromRules(rules);

  // Create nodes for each state - preserve existing positions if available
  const nodes: Node[] = states.map((state, index) => {
    const existingNode = existingNodes.find(node => node.id === state);
    const defaultPosition = {
      x: (index % 3) * 200 + 100,
      y: Math.floor(index / 3) * 150 + 100,
    };

    return {
      id: state,
      type: 'stateNode',
      position: existingNode?.position || defaultPosition,
      data: {
        label: state,
        isStart: isStartState(state),
        isHalt: isHaltState(state),
      },
    };
  });

  // Calculate optimal edge handle distribution
  const edgeHandles = calculateEdgeHandles(rules);
  
  // Group rules by source-target pairs to handle multiple edges between same nodes
  const edgeGroups: Record<string, Rule[]> = {};
  rules.forEach((rule) => {
    const key = `${rule.in_state}-${rule.new_state}`;
    if (!edgeGroups[key]) edgeGroups[key] = [];
    edgeGroups[key].push(rule);
  });

  // Create edges for each rule with distributed handles
  const edges: Edge[] = [];
  
  Object.values(edgeGroups).forEach((groupRules) => {
    groupRules.forEach((rule, index) => {
      const edgeId = `edge-${rule.id}`;
      const sourceNode = nodes.find(n => n.id === rule.in_state);
      const targetNode = nodes.find(n => n.id === rule.new_state);
      
      let sourceHandle: string | undefined;
      let targetHandle: string | undefined;
      
      // Use calculated handles or compute based on node positions
      if (edgeHandles[edgeId]) {
        sourceHandle = edgeHandles[edgeId].sourceHandle;
        targetHandle = edgeHandles[edgeId].targetHandle;
      } else if (sourceNode && targetNode) {
        const optimalHandles = getOptimalHandlePositions(
          sourceNode.position.x,
          sourceNode.position.y,
          targetNode.position.x,
          targetNode.position.y,
          index,
          index
        );
        sourceHandle = optimalHandles.sourceHandle;
        targetHandle = optimalHandles.targetHandle;
      }
      
      edges.push({
        id: edgeId,
        source: rule.in_state,
        target: rule.new_state,
        sourceHandle,
        targetHandle,
        type: 'transitionEdge',
        data: {
          read: rule.read,
          write: rule.write,
          direction: rule.direction,
          ruleId: rule.id,
        },
      });
    });
  });

  return { nodes, edges };
}

/**
 * Update React Flow data while preserving positions
 */
export function updateReactFlowFromRules(
  rules: Rule[],
  currentNodes: Node[],
  currentEdges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
  return transformRulesToReactFlow(rules, currentNodes);
}

/**
 * Get default node positions in a circular layout
 */
export function getDefaultNodePositions(
  nodes: Node[],
  width: number = 600,
  height: number = 400
): Node[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;
  
  return nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - 40; // Offset by half node width
    const y = centerY + radius * Math.sin(angle) - 40; // Offset by half node height
    
    return {
      ...node,
      position: { x, y },
    };
  });
}

/**
 * Check if nodes need default positions
 */
export function needsDefaultPositions(nodes: Node[]): boolean {
  return nodes.some(node => !node.position || (node.position.x === 0 && node.position.y === 0));
}

/**
 * Calculate the best handle positions for edges to minimize overlapping
 */
function calculateEdgeHandles(rules: Rule[]): Record<string, { sourceHandle: string; targetHandle: string }> {
  const edgeHandles: Record<string, { sourceHandle: string; targetHandle: string }> = {};
  
  // Group edges by source and target nodes to distribute handles
  const sourceEdgeGroups: Record<string, string[]> = {};
  const targetEdgeGroups: Record<string, string[]> = {};
  
  rules.forEach((rule) => {
    const edgeId = `edge-${rule.id}`;
    const sourceId = rule.in_state.trim();
    const targetId = rule.new_state.trim();
    
    if (!sourceEdgeGroups[sourceId]) sourceEdgeGroups[sourceId] = [];
    if (!targetEdgeGroups[targetId]) targetEdgeGroups[targetId] = [];
    
    sourceEdgeGroups[sourceId].push(edgeId);
    targetEdgeGroups[targetId].push(edgeId);
  });
  
  // Assign source handles - distribute evenly around the node
  Object.entries(sourceEdgeGroups).forEach(([nodeId, edgeIds]) => {
    edgeIds.forEach((edgeId, index) => {
      const handleIndex = index % HANDLE_POSITIONS.length;
      const sourceHandle = `${HANDLE_POSITIONS[handleIndex]}-source`;
      
      if (!edgeHandles[edgeId]) {
        edgeHandles[edgeId] = { sourceHandle, targetHandle: '' };
      } else {
        edgeHandles[edgeId].sourceHandle = sourceHandle;
      }
    });
  });
  
  // Assign target handles - distribute evenly around the node
  Object.entries(targetEdgeGroups).forEach(([nodeId, edgeIds]) => {
    edgeIds.forEach((edgeId, index) => {
      const handleIndex = index % HANDLE_POSITIONS.length;
      const targetHandle = `${HANDLE_POSITIONS[handleIndex]}-target`;
      
      if (!edgeHandles[edgeId]) {
        edgeHandles[edgeId] = { sourceHandle: '', targetHandle };
      } else {
        edgeHandles[edgeId].targetHandle = targetHandle;
      }
    });
  });
  
  return edgeHandles;
}

/**
 * Calculate optimal handle positions for an edge based on node positions
 */
function getOptimalHandlePositions(
  sourceX: number, 
  sourceY: number, 
  targetX: number, 
  targetY: number,
  sourceIndex: number = 0,
  targetIndex: number = 0
): { sourceHandle: string; targetHandle: string } {
  // Calculate angle between nodes
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);
  
  // Convert angle to handle position (0 = right, π/2 = down, π = left, 3π/2 = up)
  const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
  const sectorSize = (2 * Math.PI) / HANDLE_POSITIONS.length;
  
  // Find the primary direction for source (outgoing edge)
  let sourceHandleIndex = Math.round(normalizedAngle / sectorSize) % HANDLE_POSITIONS.length;
  
  // Find the primary direction for target (incoming edge) - opposite direction
  let targetHandleIndex = Math.round((normalizedAngle + Math.PI) / sectorSize) % HANDLE_POSITIONS.length;
  
  // Add offset based on edge index to distribute multiple edges
  sourceHandleIndex = (sourceHandleIndex + sourceIndex) % HANDLE_POSITIONS.length;
  targetHandleIndex = (targetHandleIndex + targetIndex) % HANDLE_POSITIONS.length;
  
  return {
    sourceHandle: `${HANDLE_POSITIONS[sourceHandleIndex]}-source`,
    targetHandle: `${HANDLE_POSITIONS[targetHandleIndex]}-target`
  };
}

/**
 * Distribute edge handles for a set of rules and node positions
 */
export function distributeEdgeHandles(
  rules: Rule[],
  nodePositions: Record<string, { x: number; y: number }>
): Record<string, { sourceHandle: string; targetHandle: string }> {
  const edgeHandles: Record<string, { sourceHandle: string; targetHandle: string }> = {};
  
  // Group rules by source-target pairs
  const edgeGroups: Record<string, Rule[]> = {};
  rules.forEach((rule) => {
    const key = `${rule.in_state}-${rule.new_state}`;
    if (!edgeGroups[key]) edgeGroups[key] = [];
    edgeGroups[key].push(rule);
  });

  // Assign handles for each edge group
  Object.values(edgeGroups).forEach((groupRules) => {
    groupRules.forEach((rule, index) => {
      const edgeId = `edge-${rule.id}`;
      const sourcePos = nodePositions[rule.in_state];
      const targetPos = nodePositions[rule.new_state];
      
      if (sourcePos && targetPos) {
        const handles = getOptimalHandlePositions(
          sourcePos.x,
          sourcePos.y,
          targetPos.x,
          targetPos.y,
          index,
          index
        );
        edgeHandles[edgeId] = handles;
      } else {
        // Fallback to simple distribution if positions not available
        const handleIndex = index % HANDLE_POSITIONS.length;
        edgeHandles[edgeId] = {
          sourceHandle: `${HANDLE_POSITIONS[handleIndex]}-source`,
          targetHandle: `${HANDLE_POSITIONS[(handleIndex + 4) % HANDLE_POSITIONS.length]}-target`
        };
      }
    });
  });

  return edgeHandles;
}