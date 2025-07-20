import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
  ConnectionLineType,
  useReactFlow,
} from '@xyflow/react';
import { Box, Typography } from '@mui/material';

import { useMachineStore, useGraphLayoutStore, useTapeStore } from '../../../../stores';
import StateNode from './StateNode';
import TransitionEdge from './TransitionEdge';
import RuleEditDialog from './RuleEditDialog';
import StateRenameDialog from './StateRenameDialog';
import type { Rule } from '../../../../types';
import { distributeEdgeHandles } from '../../../utils/reactFlowTransforms';

interface ReactFlowGraphProps {
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
  onAddRule?: () => void;
}

// Define node and edge types
const nodeTypes = {
  stateNode: StateNode,
};

const edgeTypes = {
  transitionEdge: TransitionEdge,
};


// Main component that needs to be inside ReactFlowProvider
function ReactFlowGraphInner({ onEditRule: _onEditRule, onDeleteRule: _onDeleteRule, onAddRule: _onAddRule }: ReactFlowGraphProps): React.ReactElement {
  const machine = useMachineStore();
  const graphLayout = useGraphLayoutStore();
  const tape = useTapeStore();
  const rules = machine.getAllRules();
  const reactFlowInstance = useReactFlow();
  
  // Dialog state
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [stateDialogOpen, setStateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [editingState, setEditingState] = useState<string>('');
  const [newStateName, setNewStateName] = useState<string>('');
  const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
  
  console.log('Rules from store:', rules);
  
  // Create a stable hash of rules to prevent infinite re-renders
  const rulesHash = useMemo(() => {
    return JSON.stringify(rules.map(rule => ({
      id: rule.id,
      in_state: rule.in_state,
      new_state: rule.new_state,
      read: rule.read,
      write: rule.write,
      direction: rule.direction
    })));
  }, [rules]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Update graph when rules change
  useEffect(() => {
    console.log('Effect triggered - rules changed');
    
    if (!rules || rules.length === 0) {
      console.log('No rules found, clearing graph');
      setNodes([]);
      setEdges([]);
      return;
    }

    // Extract unique states - be more permissive with filtering
    const stateSet = new Set<string>();
    rules.forEach(rule => {
      console.log('Processing rule:', rule);
      if (rule.in_state && rule.in_state.trim()) {
        stateSet.add(rule.in_state.trim());
      }
      if (rule.new_state && rule.new_state.trim()) {
        stateSet.add(rule.new_state.trim());
      }
    });
    const states = Array.from(stateSet);
    
    console.log('Extracted states:', states);

    if (states.length === 0) {
      console.log('No valid states found');
      setNodes([]);
      setEdges([]);
      return;
    }

    // Create nodes with saved positions
    const newNodes: Node[] = states.map((state, index) => {
      const savedPosition = graphLayout.getNodePosition(state);
      const defaultPosition = {
        x: (index % 3) * 200 + 100,
        y: Math.floor(index / 3) * 150 + 100,
      };
      
      return {
        id: state,
        type: 'stateNode',
        position: savedPosition || defaultPosition,
        data: {
          label: state,
          isStart: state.toUpperCase() === 'START',
          isHalt: state.toUpperCase() === 'HALT',
          isCurrent: machine.isRunning && tape.tapeInternalState === state,
        },
      };
    });

    // Create edges with distributed handles to prevent overlaps
    const validRules = rules.filter(rule => 
      rule.in_state && rule.in_state.trim() && 
      rule.new_state && rule.new_state.trim() &&
      stateSet.has(rule.in_state.trim()) && 
      stateSet.has(rule.new_state.trim())
    );

    // Create node position mapping for handle distribution
    const nodePositions = newNodes.reduce((acc, node) => {
      acc[node.id] = node.position;
      return acc;
    }, {} as Record<string, { x: number; y: number }>);

    // Calculate distributed handles for all edges
    const distributedHandles = distributeEdgeHandles(validRules, nodePositions);

    const newEdges: Edge[] = [];
    
    // Process all rules with distributed handles
    validRules.forEach((rule) => {
      const sourceId = rule.in_state.trim();
      const targetId = rule.new_state.trim();
      
      console.log(`Creating edge from ${sourceId} to ${targetId}`);
      
      // Get saved edge layout or use distributed handles
      const edgeId = `edge-${rule.id}`;
      const savedEdgeLayout = graphLayout.getEdgeLayout(edgeId);
      const distributedHandle = distributedHandles[edgeId];
      
      // Use saved layout if available, otherwise use distributed handles
      const sourceHandle = savedEdgeLayout?.sourceHandle || distributedHandle?.sourceHandle;
      const targetHandle = savedEdgeLayout?.targetHandle || distributedHandle?.targetHandle;

      const edge: Edge = {
        id: edgeId,
        type: 'transitionEdge',
        source: sourceId,
        target: targetId,
        sourceHandle,
        targetHandle,
        data: {
          read: rule.read || '#',
          write: rule.write || '#',
          direction: rule.direction,
          ruleId: rule.id,
          isActive: machine.isRunning && machine.highlightedRow === rule.id,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
      
      newEdges.push(edge);
    });

    console.log('Setting nodes:', newNodes);
    console.log('Setting edges:', newEdges);
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [rulesHash, machine.highlightedRow, machine.isRunning, tape.tapeInternalState]); // Use rulesHash instead of rules to prevent infinite loops


  // Interactive handlers
  const onConnect = useCallback((connection: Connection) => {
    console.log('New connection:', connection);
    
    if (connection.source && connection.target) {
      setPendingConnection({
        source: connection.source,
        target: connection.target,
      });
      
      // Save the handle layout for the new connection
      const tempEdgeId = `temp-${connection.source}-${connection.target}`;
      graphLayout.updateEdgeLayout(tempEdgeId, {
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
      });
      
      setRuleDialogOpen(true);
    }
  }, [graphLayout]);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    console.log('Edge clicked:', edge);
    
    // Find the rule associated with this edge
    const ruleId = edge.id.replace('edge-', '');
    const rule = machine.getRule(ruleId);
    
    if (rule) {
      setEditingRule({ id: ruleId, ...rule });
      setRuleDialogOpen(true);
    }
  }, [machine]);

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Node double clicked:', node);
    
    setEditingState(node.id);
    setStateDialogOpen(true);
  }, []);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    // Check if this is a double-click on empty space
    if (event.detail === 2) {
      console.log('Pane double-clicked at:', event.clientX, event.clientY);
      
      // Get click position relative to the flow
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      console.log('Flow position:', position);
      
      // Generate a unique state name
      const existingStates = machine.getStateNames();
      let newStateName = 'S1';
      let counter = 1;
      while (existingStates.includes(newStateName)) {
        counter++;
        newStateName = `S${counter}`;
      }
      
      // Create new node
      const newNode: Node = {
        id: newStateName,
        type: 'stateNode',
        position,
        data: {
          label: newStateName,
          isStart: false,
          isHalt: false,
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      machine.addState(newStateName, position);
      
      // Open create dialog (track the new state name)
      setNewStateName(newStateName);
      setEditingState('');
      setStateDialogOpen(true);
    }
  }, [reactFlowInstance, machine, setNodes]);

  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    console.log('Nodes to delete:', nodesToDelete);
    
    nodesToDelete.forEach(node => {
      machine.deleteState(node.id);
    });
  }, [machine]);

  const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    console.log('Edges to delete:', edgesToDelete);
    
    edgesToDelete.forEach(edge => {
      const ruleId = edge.id.replace('edge-', '');
      machine.deleteRule(ruleId);
      // Remove edge layout
      graphLayout.removeEdgeLayout(edge.id);
    });
  }, [machine, graphLayout]);

  // Handle edge reconnection
  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    console.log('Edge reconnected:', oldEdge, newConnection);
    
    // Extract rule ID from edge ID
    const ruleId = oldEdge.id.replace('edge-', '');
    
    // Update the underlying rule in the machine store
    if (newConnection.source && newConnection.target) {
      machine.updateRuleConnection(ruleId, newConnection.source, newConnection.target);
    }
    
    // Update the edge layout with new handles
    graphLayout.updateEdgeLayout(oldEdge.id, {
      sourceHandle: newConnection.sourceHandle || undefined,
      targetHandle: newConnection.targetHandle || undefined,
    });
    
    // Update the edge in the graph
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === oldEdge.id
          ? {
              ...edge,
              source: newConnection.source!,
              target: newConnection.target!,
              sourceHandle: newConnection.sourceHandle || undefined,
              targetHandle: newConnection.targetHandle || undefined,
            }
          : edge
      )
    );
  }, [machine, graphLayout, setEdges]);

  // Handle node position changes
  const onNodeDrag = useCallback((_event: React.MouseEvent, node: Node) => {
    // Save position during drag
    graphLayout.updateNodePosition(node.id, node.position);
  }, [graphLayout]);

  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    // Save final position
    graphLayout.updateNodePosition(node.id, node.position);
    console.log(`Node ${node.id} moved to:`, node.position);
  }, [graphLayout]);

  // Handle viewport changes
  const onViewportChange = useCallback((viewport: { x: number; y: number; zoom: number }) => {
    graphLayout.updateViewport(viewport);
  }, [graphLayout]);

  // Dialog handlers
  const handleRuleDialogSave = useCallback((ruleData: { read: string; write: string; direction: 'L' | 'R' }) => {
    if (pendingConnection) {
      // Create new rule
      const ruleId = machine.addRuleFromConnection(pendingConnection.source, pendingConnection.target, ruleData);
      
      // Transfer the handle layout from temp to the actual rule
      const tempEdgeId = `temp-${pendingConnection.source}-${pendingConnection.target}`;
      const actualEdgeId = `edge-${ruleId}`;
      const tempLayout = graphLayout.getEdgeLayout(tempEdgeId);
      
      if (tempLayout) {
        graphLayout.updateEdgeLayout(actualEdgeId, tempLayout);
        graphLayout.removeEdgeLayout(tempEdgeId);
      }
      
      setPendingConnection(null);
    }
    setRuleDialogOpen(false);
    setEditingRule(null);
  }, [machine, pendingConnection, graphLayout]);

  const handleRuleDialogClose = useCallback(() => {
    setRuleDialogOpen(false);
    setEditingRule(null);
    setPendingConnection(null);
  }, []);

  const handleStateDialogSave = useCallback((finalStateName: string, stateType: 'normal' | 'start' | 'halt') => {
    if (editingState) {
      // Rename existing state
      if (editingState !== finalStateName) {
        machine.renameState(editingState, finalStateName);
        
        // Update the node in the graph
        setNodes((nds) => 
          nds.map(node => 
            node.id === editingState 
              ? { 
                  ...node, 
                  id: finalStateName,
                  data: {
                    ...node.data,
                    label: finalStateName,
                    isStart: stateType === 'start',
                    isHalt: stateType === 'halt',
                  }
                }
              : node
          )
        );
        
        // Update edges that reference the old state name
        setEdges((eds) => 
          eds.map(edge => ({
            ...edge,
            source: edge.source === editingState ? finalStateName : edge.source,
            target: edge.target === editingState ? finalStateName : edge.target,
          }))
        );
      } else {
        // Just update the state type
        setNodes((nds) => 
          nds.map(node => 
            node.id === editingState 
              ? { 
                  ...node, 
                  data: {
                    ...node.data,
                    isStart: stateType === 'start',
                    isHalt: stateType === 'halt',
                  }
                }
              : node
          )
        );
      }
    } else if (newStateName) {
      // Create new state (rename from temp name)
      if (newStateName !== finalStateName) {
        machine.renameState(newStateName, finalStateName);
        
        // Update the node in the graph
        setNodes((nds) => 
          nds.map(node => 
            node.id === newStateName 
              ? { 
                  ...node, 
                  id: finalStateName,
                  data: {
                    ...node.data,
                    label: finalStateName,
                    isStart: stateType === 'start',
                    isHalt: stateType === 'halt',
                  }
                }
              : node
          )
        );
        
        // Update edges that reference the temp state name
        setEdges((eds) => 
          eds.map(edge => ({
            ...edge,
            source: edge.source === newStateName ? finalStateName : edge.source,
            target: edge.target === newStateName ? finalStateName : edge.target,
          }))
        );
      } else {
        // Just update the state type
        setNodes((nds) => 
          nds.map(node => 
            node.id === newStateName 
              ? { 
                  ...node, 
                  data: {
                    ...node.data,
                    isStart: stateType === 'start',
                    isHalt: stateType === 'halt',
                  }
                }
              : node
          )
        );
      }
    }
    
    setStateDialogOpen(false);
    setEditingState('');
    setNewStateName('');
  }, [machine, editingState, newStateName, setNodes, setEdges]);

  const handleStateDialogClose = useCallback(() => {
    setStateDialogOpen(false);
    setEditingState('');
    setNewStateName('');
  }, []);

  return (
    <>
      <Box sx={{ height: 'auto', width: '100%' }}>
        
        {/* Graph visualization */}
        {nodes.length === 0 ? (
          <Box 
            sx={{ 
              height: 400,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 1,
              borderColor: 'grey.300',
              borderRadius: 1,
              bgcolor: 'grey.50',
            }}
          >
            <Typography color="text.secondary">
              No states to display. Add some rules to see the state diagram.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            height: 400, 
            border: 1, 
            borderColor: 'grey.300', 
            borderRadius: 1, 
            overflow: 'hidden',
            '& .react-flow__edge': {
              cursor: 'pointer',
            },
            '& .react-flow__edge-path': {
              strokeWidth: 3,
              stroke: '#555',
            },
            '& .react-flow__edge:hover .react-flow__edge-path': {
              stroke: '#2196f3',
              strokeWidth: 4,
            },
            '& .react-flow__edge.selected .react-flow__edge-path': {
              stroke: '#1976d2',
              strokeWidth: 4,
            },
            '& .react-flow__handle': {
              width: 10,
              height: 10,
              opacity: 0.6,
              transition: 'all 0.2s ease',
            },
            '& .react-flow__handle:hover': {
              opacity: 1,
              transform: 'scale(1.4)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            },
            '& .react-flow__handle.connectionindicator': {
              opacity: 1,
              transform: 'scale(1.5)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            },
            '& .react-flow__node:hover .react-flow__handle': {
              opacity: 0.8,
            },
            // Pulse animation for active edges
            '@keyframes pulse': {
              '0%': {
                filter: 'drop-shadow(0 0 4px #ff6b00)',
                strokeWidth: 5,
              },
              '50%': {
                filter: 'drop-shadow(0 0 8px #ff6b00)',
                strokeWidth: 6,
              },
              '100%': {
                filter: 'drop-shadow(0 0 4px #ff6b00)',
                strokeWidth: 5,
              },
            },
          }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onReconnect={onReconnect}
              onEdgeClick={onEdgeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={onNodeDragStop}
              onPaneClick={onPaneClick}
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
              onViewportChange={onViewportChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
              maxZoom={2}
              defaultViewport={graphLayout.viewport}
              deleteKeyCode={['Backspace', 'Delete']}
              multiSelectionKeyCode={['Meta', 'Ctrl']}
              connectionLineStyle={{ strokeWidth: 3, stroke: '#555' }}
              connectionLineType={ConnectionLineType.SmoothStep}
              snapToGrid={true}
              snapGrid={[20, 20]}
            >
              <Background />
              <Controls />
              <svg>
                <defs>
                  <marker
                    id="react-flow__arrowclosed"
                    markerWidth="12"
                    markerHeight="12"
                    refX="6"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <polygon points="0,0 0,6 6,3" fill="#555" />
                  </marker>
                </defs>
              </svg>
            </ReactFlow>
          </Box>
        )}
      </Box>
      
      {/* Dialogs */}
      <RuleEditDialog
        open={ruleDialogOpen}
        onClose={handleRuleDialogClose}
        rule={editingRule}
        sourceState={pendingConnection?.source}
        targetState={pendingConnection?.target}
        onSave={handleRuleDialogSave}
      />
      
      <StateRenameDialog
        open={stateDialogOpen}
        onClose={handleStateDialogClose}
        currentStateName={editingState || newStateName}
        onSave={handleStateDialogSave}
      />
    </>
  );
}

// Main wrapper component
export function ReactFlowGraph(props: ReactFlowGraphProps): React.ReactElement {
  return (
    <ReactFlowProvider>
      <ReactFlowGraphInner {...props} />
    </ReactFlowProvider>
  );
}

export default ReactFlowGraph;