import React, { memo, Fragment } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Box, Typography } from '@mui/material';

export interface StateNodeData {
  label: string;
  isStart?: boolean;
  isHalt?: boolean;
  isCurrent?: boolean;
}

function StateNode({ data, selected }: NodeProps): React.ReactElement {
  const { label, isStart = false, isHalt = false, isCurrent = false } = (data as unknown as StateNodeData) || {};


  // Determine colors based on state type
  const getNodeColors = () => {
    if (isCurrent) {
      return {
        background: '#ff6b00',
        border: '#e65100',
        text: '#ffffff',
      };
    }
    if (isStart) {
      return {
        background: selected ? '#4caf50' : '#81c784',
        border: '#2e7d32',
        text: '#ffffff',
      };
    }
    if (isHalt) {
      return {
        background: selected ? '#f44336' : '#e57373',
        border: '#c62828',
        text: '#ffffff',
      };
    }
    return {
      background: selected ? '#2196f3' : '#90caf9',
      border: '#1565c0',
      text: '#ffffff',
    };
  };

  const colors = getNodeColors();

  const nodeStyle = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: colors.background,
    border: `3px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    boxShadow: isCurrent 
      ? `0 0 0 2px ${colors.border}, 0 0 8px rgba(255,107,0,0.5)` 
      : selected 
      ? `0 0 0 2px ${colors.border}, 0 0 0 4px rgba(0,0,0,0.1)` 
      : '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    animation: isCurrent ? 'pulse 1.5s ease-in-out infinite' : 'none',
  };

  // Handle style that blends with the node
  const handleStyle = {
    background: colors.border,
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: `2px solid ${colors.background}`,
    cursor: 'crosshair',
    zIndex: 10,
    opacity: 0.6,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  };


  // Create handle configurations for all 8 positions
  const handleConfigs = [
    // Cardinal directions
    { id: 'top', position: Position.Top, style: { top: '-6px', left: '50%', transform: 'translateX(-50%)' } },
    { id: 'bottom', position: Position.Bottom, style: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' } },
    { id: 'left', position: Position.Left, style: { left: '-6px', top: '50%', transform: 'translateY(-50%)' } },
    { id: 'right', position: Position.Right, style: { right: '-6px', top: '50%', transform: 'translateY(-50%)' } },
    
    // Diagonal directions - positioned at 45-degree angles
    { id: 'top-left', position: Position.Top, style: { 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%) translate(-28px, -28px)' 
    }},
    { id: 'top-right', position: Position.Top, style: { 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%) translate(28px, -28px)' 
    }},
    { id: 'bottom-left', position: Position.Bottom, style: { 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%) translate(-28px, 28px)' 
    }},
    { id: 'bottom-right', position: Position.Bottom, style: { 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%) translate(28px, 28px)' 
    }},
  ];

  return (
    <Box sx={nodeStyle}>
      {/* Create handles for each position - both source and target */}
      {handleConfigs.map((config) => (
        <Fragment key={config.id}>
          <Handle
            id={`${config.id}-target`}
            type="target"
            position={config.position}
            style={{
              ...handleStyle,
              ...config.style,
            }}
          />
          <Handle
            id={`${config.id}-source`}
            type="source"
            position={config.position}
            style={{
              ...handleStyle,
              ...config.style,
            }}
          />
        </Fragment>
      ))}

      {/* State label */}
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{
          color: colors.text,
          fontSize: '0.8rem',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: '70px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </Typography>


      {/* Halt state indicator */}
      {isHalt && (
        <Box
          sx={{
            position: 'absolute',
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: '50%',
            border: '2px solid white',
            opacity: 0.7,
          }}
        />
      )}
    </Box>
  );
}

export default memo(StateNode);