import React, { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';
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
  hasDragged?: boolean;
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
  const [labelPosition, setLabelPositionInternal] = useState<{ x: number; y: number } | null>(null);
  const labelPositionRef = useRef<{ x: number; y: number } | null>(null);
  
  // Custom setLabelPosition wrapper that updates both state and ref
  const setLabelPosition = useCallback((position: { x: number; y: number } | null) => {
    labelPositionRef.current = position;
    setLabelPositionInternal(position);
  }, []);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const edgeHasDraggedRef = useRef(false);
  const edgeMouseDownRef = useRef<{ x: number; y: number } | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save function to avoid excessive store updates during drag
  const debouncedSave = useCallback((position: { x: number; y: number }) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout to save after a short delay
    saveTimeoutRef.current = setTimeout(() => {
      graphLayout.updateEdgeLayout(id, { controlPoint: position });
      saveTimeoutRef.current = null;
    }, 50); // 50ms debounce
  }, [id, graphLayout]);

  // Load saved label position on mount only (now handled in memoized calculation above)
  useEffect(() => {
    // Only update state if we have a position in ref but not in state
    if (labelPositionRef.current && !labelPosition) {
      setLabelPositionInternal(labelPositionRef.current);
    }
  }, [labelPosition]);

  // Track component lifecycle and cleanup
  useEffect(() => {
    return () => {
      // Clear any pending save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [id]);

  // Create the label text
  const label = `${safeRead}→${safeWrite},${safeDirection}`;

  // Memoize the default path calculations to prevent recalculation on every render
  const defaultPathData = useMemo(() => {
    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 8,
    });
  }, [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]);

  const [defaultEdgePath, defaultLabelX, defaultLabelY] = defaultPathData;

  // Use custom label position if available (from state or ref), otherwise use path midpoint
  // Initialize with saved position immediately if available
  const finalLabelPosition = useMemo(() => {
    const current = labelPosition || labelPositionRef.current;
    if (!current) {
      // On first render, try to get saved position immediately
      const savedLayout = graphLayout.getEdgeLayout(id);
      if (savedLayout?.controlPoint) {
        labelPositionRef.current = savedLayout.controlPoint;
        return savedLayout.controlPoint;
      }
    }
    return current;
  }, [labelPosition, id, graphLayout]);

  const labelX = finalLabelPosition?.x ?? defaultLabelX;
  const labelY = finalLabelPosition?.y ?? defaultLabelY;


  // Create edge path that routes through the label position
  const getPathThroughLabel = () => {
    if (!finalLabelPosition) {
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

  // Choose the appropriate marker based on edge state
  const getMarkerEnd = () => {
    if (safeIsActive) {
      return "url(#react-flow__arrowclosed-orange)";
    } else if (selected) {
      return "url(#react-flow__arrowclosed-blue)";
    } else {
      return "url(#react-flow__arrowclosed)";
    }
  };

  // Handle label drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    
    // Calculate initial offset between mouse and control point
    const rect = (e.target as Element).closest('.react-flow')?.getBoundingClientRect();
    if (rect && reactFlowInstance) {
      const mouseFlowPosition = reactFlowInstance.screenToFlowPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      
      // Use the actual visual position (labelX, labelY) instead of stored position
      // This ensures the offset is calculated from where the label actually appears
      const actualLabelPosition = { x: labelX, y: labelY };
      
      dragOffsetRef.current = {
        x: mouseFlowPosition.x - actualLabelPosition.x,
        y: mouseFlowPosition.y - actualLabelPosition.y,
      };
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as Element).closest('.react-flow')?.getBoundingClientRect();
      if (rect && reactFlowInstance && dragOffsetRef.current) {
        // Mark that we've dragged
        if (!hasDraggedRef.current) {
          hasDraggedRef.current = true;
        }
        
        // Convert screen coordinates to flow coordinates
        const mouseFlowPosition = reactFlowInstance.screenToFlowPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        
        // Apply offset to maintain relative position
        const newPosition = {
          x: mouseFlowPosition.x - dragOffsetRef.current.x,
          y: mouseFlowPosition.y - dragOffsetRef.current.y,
        };
        
        setLabelPosition(newPosition);
        
        // Save position to store continuously during drag (debounced)
        debouncedSave(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragOffsetRef.current = null;
      
      // Position is now saved during drag via debouncedSave - no need to save here
      // Final save will happen from the debounced timeout
      
      // Update edge data to indicate drag occurred
      if (hasDraggedRef.current) {
        const edges = reactFlowInstance.getEdges();
        const updatedEdges = edges.map(edge => 
          edge.id === id 
            ? { ...edge, data: { ...edge.data, hasDragged: true } }
            : edge
        );
        reactFlowInstance.setEdges(updatedEdges);
        
        // Reset drag state after a short delay
        setTimeout(() => {
          const edges = reactFlowInstance.getEdges();
          const resetEdges = edges.map(edge => 
            edge.id === id 
              ? { ...edge, data: { ...edge.data, hasDragged: false } }
              : edge
          );
          reactFlowInstance.setEdges(resetEdges);
          hasDraggedRef.current = false;
        }, 100);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, graphLayout, reactFlowInstance, defaultLabelX, defaultLabelY, debouncedSave]);

  // Handle edge path mouse events for drag detection
  const handleEdgeMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('🔵 Edge mousedown:', id);
    edgeHasDraggedRef.current = false;
    edgeMouseDownRef.current = { x: e.clientX, y: e.clientY };
  }, [id]);

  const handleEdgeMouseUp = useCallback((e: React.MouseEvent) => {
    console.log('🔵 Edge mouseup:', id, 'hasDragged:', edgeHasDraggedRef.current);
    
    // Check if mouse moved significantly (drag detection)
    if (edgeMouseDownRef.current) {
      const deltaX = Math.abs(e.clientX - edgeMouseDownRef.current.x);
      const deltaY = Math.abs(e.clientY - edgeMouseDownRef.current.y);
      const threshold = 5; // pixels
      
      if (deltaX > threshold || deltaY > threshold) {
        edgeHasDraggedRef.current = true;
        console.log('🔵 Edge drag detected:', { deltaX, deltaY });
      }
    }
    
    edgeMouseDownRef.current = null;
  }, [id]);

  const handleEdgeClick = useCallback((e: React.MouseEvent) => {
    console.log('🔵 Edge click:', id, 'edgeHasDragged:', edgeHasDraggedRef.current, 'labelHasDragged:', hasDraggedRef.current);
    
    // Prevent the parent's onEdgeClick if we dragged the edge path OR the label
    if (edgeHasDraggedRef.current || hasDraggedRef.current) {
      console.log('🔵 Preventing edge click due to drag (edge:', edgeHasDraggedRef.current, 'label:', hasDraggedRef.current, ')');
      e.preventDefault();
      e.stopPropagation();
      
      // Reset drag states after blocking
      setTimeout(() => {
        edgeHasDraggedRef.current = false;
        hasDraggedRef.current = false;
      }, 10);
      return;
    }
  }, [id]);

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
        markerEnd={getMarkerEnd()}
        style={{
          stroke: safeIsActive ? '#ff6b00' : isDragging ? '#ff9800' : selected ? '#2196f3' : '#555',
          strokeWidth: safeIsActive ? 5 : isDragging ? 5 : selected ? 4 : 3,
          strokeDasharray: isDragging ? '5,5' : 'none',
          transition: 'all 0.2s ease',
          filter: safeIsActive ? 'drop-shadow(0 0 4px #ff6b00)' : 'none',
          animation: safeIsActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
        onMouseDown={handleEdgeMouseDown}
        onMouseUp={handleEdgeMouseUp}
        onClick={handleEdgeClick}
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