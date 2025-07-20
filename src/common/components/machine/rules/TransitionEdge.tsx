import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import {
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { useGraphLayoutStore } from '../../../../stores';

export interface TransitionEdgeData {
  read: string;
  write: string;
  direction: 'L' | 'R';
  ruleId: string;
  isActive: boolean;
}

function TransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps): React.ReactElement {
  const { read, write, direction, isActive } = (data as unknown as TransitionEdgeData) || {};
  
  // Defensive programming - ensure we have valid data
  const safeRead = read || '#';
  const safeWrite = write || '#';
  const safeDirection = direction || 'R';
  const safeIsActive = Boolean(isActive);
  
  // Debug logging (can be removed after testing)
  if (safeIsActive) {
    console.log(`TransitionEdge ${id} is ACTIVE!`, { isActive, safeIsActive });
  }
  const graphLayout = useGraphLayoutStore();
  const reactFlowInstance = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [labelPosition, setLabelPosition] = useState<{ x: number; y: number } | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);

  // Load saved label position on mount
  useEffect(() => {
    const savedLayout = graphLayout.getEdgeLayout(id);
    if (savedLayout?.controlPoint) {
      setLabelPosition(savedLayout.controlPoint);
    }
  }, [id, graphLayout]);

  // Create the label text
  const label = `${safeRead}→${safeWrite},${safeDirection}`;

  // Calculate label position (default to midpoint of the edge path)
  const [defaultEdgePath, defaultLabelX, defaultLabelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  // Use custom label position if dragged, otherwise use path midpoint
  const labelX = labelPosition?.x || defaultLabelX;
  const labelY = labelPosition?.y || defaultLabelY;

  // Create edge path that routes through the label position
  const getPathThroughLabel = () => {
    if (!labelPosition) {
      // No custom position, use default path
      return defaultEdgePath;
    }

    // Create a path that goes: source -> label -> target
    const [pathToLabel] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX: labelX,
      targetY: labelY,
      targetPosition: Position.Top,
      borderRadius: 8,
    });

    const [pathFromLabel] = getSmoothStepPath({
      sourceX: labelX,
      sourceY: labelY,
      sourcePosition: Position.Bottom,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 8,
    });

    // Combine the paths by connecting them
    return `${pathToLabel} ${pathFromLabel.substring(1)}`; // Remove the M from the second path
  };

  const edgePath = getPathThroughLabel();

  // Handle label drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    
    // Don't clear highlighting when just dragging labels - this is visual positioning only
    
    // Calculate initial offset between mouse and control point
    const rect = (e.target as Element).closest('.react-flow')?.getBoundingClientRect();
    if (rect && reactFlowInstance) {
      const mouseFlowPosition = reactFlowInstance.screenToFlowPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      
      const currentLabelPosition = labelPosition || { x: defaultLabelX, y: defaultLabelY };
      
      dragOffsetRef.current = {
        x: mouseFlowPosition.x - currentLabelPosition.x,
        y: mouseFlowPosition.y - currentLabelPosition.y,
      };
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as Element).closest('.react-flow')?.getBoundingClientRect();
      if (rect && reactFlowInstance && dragOffsetRef.current) {
        // Mark that we've dragged
        hasDraggedRef.current = true;
        
        // Convert screen coordinates to flow coordinates
        const mouseFlowPosition = reactFlowInstance.screenToFlowPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        
        // Apply offset to maintain relative position
        setLabelPosition({
          x: mouseFlowPosition.x - dragOffsetRef.current.x,
          y: mouseFlowPosition.y - dragOffsetRef.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragOffsetRef.current = null;
      
      // Save label position to store
      if (labelPosition) {
        graphLayout.updateEdgeLayout(id, { controlPoint: labelPosition });
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, graphLayout, labelPosition, reactFlowInstance, defaultLabelX, defaultLabelY]);

  // Handle label double-click to open edit dialog
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only open dialog if we haven't dragged
    if (!hasDraggedRef.current) {
      // TODO: Add logic to open rule edit dialog
      console.log('Double-click to edit rule:', { read: safeRead, write: safeWrite, direction: safeDirection });
    }
  }, [safeRead, safeWrite, safeDirection]);

  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        markerEnd="url(#react-flow__arrowclosed)"
        style={{
          stroke: safeIsActive ? '#ff6b00' : isDragging ? '#ff9800' : selected ? '#2196f3' : '#555',
          strokeWidth: safeIsActive ? 5 : isDragging ? 5 : selected ? 4 : 3,
          strokeDasharray: isDragging ? '5,5' : 'none',
          transition: 'all 0.2s ease',
          filter: safeIsActive ? 'drop-shadow(0 0 4px #ff6b00)' : 'none',
          animation: safeIsActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
      />
      
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            fontWeight: safeIsActive ? '900' : 'bold',
            background: safeIsActive ? '#fff4e6' : isDragging ? '#fff3e0' : 'white',
            padding: '4px 8px',
            borderRadius: 4,
            border: safeIsActive ? '2px solid #ff6b00' : isDragging ? '2px solid #ff9800' : selected ? '2px solid #2196f3' : '1px solid #ccc',
            pointerEvents: 'all',
            color: safeIsActive ? '#ff6b00' : isDragging ? '#ff9800' : selected ? '#2196f3' : '#333',
            cursor: isDragging ? 'grabbing' : 'grab',
            boxShadow: safeIsActive ? '0 4px 8px rgba(255,107,0,0.3)' : isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
          className="nodrag nopan"
          onMouseDown={handleDragStart}
          onDoubleClick={handleDoubleClick}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default TransitionEdge;