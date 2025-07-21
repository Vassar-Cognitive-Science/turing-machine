import React, { useState } from 'react';
import {
  Paper,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';

import { useTapeStore, useMachineExecution, useTapeOperations } from '../../../stores';
import type { VisibleCell } from '../../../types';

export function TapeDisplay(): React.ReactElement {
  const tape = useTapeStore();
  const machineExecution = useMachineExecution();
  const tapeOps = useTapeOperations();
  const visibleCells = tapeOps.visibleCells;
  
  // Find the head cell to position the START indicator
  const headIndex = visibleCells.findIndex((cell: VisibleCell) => cell.isHead);
  
  // Track drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    cellId: string;
  } | null>(null);
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      
      {/* Machine State Indicator (Head) */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 1,
        position: 'relative',
        height: 40
      }}>
        {headIndex !== -1 && (
          <Box
            sx={{
              position: 'absolute',
              left: `calc(50% + ${(headIndex - (visibleCells.length - 1) / 2) * 50}px)`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {/* Expanded Drag Area */}
            <Box
              onMouseDown={(e: React.MouseEvent) => {
                if (machineExecution.isRunning) return;
                
                // Don't start drag if clicking on the input field
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT') {
                  return;
                }
                
                e.preventDefault();
                setIsDragging(true);
                
                // Add throttled global mouse move handler
                let lastMoveTime = 0;
                const handleMouseMove = (event: MouseEvent) => {
                  const now = Date.now();
                  if (now - lastMoveTime < 16) return; // Throttle to ~60fps
                  lastMoveTime = now;
                  
                  const tapeContainer = document.querySelector('[data-tape-container]') as HTMLElement;
                  if (tapeContainer) {
                    const rect = tapeContainer.getBoundingClientRect();
                    const mouseX = event.clientX - rect.left;
                    const cellWidth = 50; // Width of each cell
                    const cellIndex = Math.floor(mouseX / cellWidth);
                    
                    // Clamp to valid range
                    const targetIndex = Math.max(0, Math.min(cellIndex, visibleCells.length - 1));
                    const targetCell = visibleCells[targetIndex];
                    
                    // Always set the head to the target cell (allow returning to same position)
                    if (targetCell) {
                      tape.setHeadPosition(targetCell.id);
                    }
                  }
                };
                
                // Add global mouse up handler
                const handleMouseUp = () => {
                  setIsDragging(false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              sx={{
                // Responsive width based on content - narrower
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${Math.max(6, tapeOps.currentState.length + 3)}ch`,
                padding: '2px 4px 4px 4px',
                boxSizing: 'content-box',
                
                
                // Thick top border as drag handle, no rounded corners
                border: '2px solid #000',
                borderTopWidth: '6px',
                backgroundColor: '#fff',
                cursor: machineExecution.isRunning ? 'default' : 'grab',
                userSelect: 'none',
                
                // Visual feedback for drag area
                '&:hover': {
                  borderColor: machineExecution.isRunning ? '#000' : '#0066cc',
                  borderTopColor: machineExecution.isRunning ? '#000' : '#0066cc',
                  backgroundColor: machineExecution.isRunning ? '#fff' : '#f9f9f9',
                },
                '&:active': {
                  cursor: machineExecution.isRunning ? 'default' : 'grabbing',
                  borderColor: machineExecution.isRunning ? '#000' : '#0052a3',
                  borderTopColor: machineExecution.isRunning ? '#000' : '#0052a3',
                },
              }}
            >
              <input
                type="text"
                value={tapeOps.currentState}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  tape.setInternalState(e.target.value || 'START');
                }}
                disabled={machineExecution.isRunning}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%',
                  cursor: 'text',
                  padding: '2px 4px',
                  borderRadius: '2px',
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                placeholder="STATE"
              />
            </Box>
            {/* Connector arrow to tape */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 0, // Move up to not be behind tape
              }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 5,
                  backgroundColor: '#000',
                }}
              />
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '6px solid #000',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Tape Display */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 0,
        mb: 3
      }}>
        {/* Left Navigation */}
        <IconButton 
          onClick={() => tape.moveTapeLeft()}
          disabled={machineExecution.isRunning}
          sx={{ mr: 1 }}
          title="Scroll tape left"
        >
          <KeyboardDoubleArrowLeft />
        </IconButton>
        
        {/* Tape Cells */}
        <Box sx={{ display: 'flex', gap: 0 }} data-tape-container>
          {visibleCells.map((cell: VisibleCell, index: number) => (
            <Box
              key={cell.id}
              onContextMenu={(e: React.MouseEvent) => {
                // Handle right-click to show context menu
                if (!machineExecution.isRunning) {
                  e.preventDefault(); // Prevent browser context menu
                  setContextMenu(
                    contextMenu === null
                      ? {
                          mouseX: e.clientX + 2,
                          mouseY: e.clientY - 6,
                          cellId: cell.id,
                        }
                      : null
                  );
                }
              }}
              sx={{
                width: 50,
                height: 50,
                border: '2px solid #000',
                backgroundColor: cell.isHead ? '#e3f2fd' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: '24px',
                fontWeight: 'bold',
                position: 'relative',
                borderRight: index === visibleCells.length - 1 ? '2px solid #000' : 'none',
                cursor: machineExecution.isRunning ? 'default' : 'pointer',
                '&:hover': machineExecution.isRunning ? {} : {
                  backgroundColor: cell.isHead ? '#bbdefb' : '#f5f5f5',
                },
              }}
              title={machineExecution.isRunning ? '' : 'Right-click for options'}
            >
              <input
                type="text"
                value={cell.val === '∅' || !cell.val ? '' : cell.val}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value.slice(-1); // Only take last character
                  
                  // Write directly to this specific cell
                  tape.writeToCell(cell.id, newValue || '∅');
                  
                  // Auto-advance: focus next cell if a symbol was entered
                  if (newValue) {
                    if (index < visibleCells.length - 1) {
                      // Regular case: move to next visible cell
                      requestAnimationFrame(() => {
                        const currentInput = e.target as HTMLInputElement;
                        const nextInput = currentInput.parentElement?.nextElementSibling?.querySelector('input') as HTMLInputElement;
                        if (nextInput) {
                          nextInput.focus();
                          nextInput.select();
                        }
                      });
                    } else if (index === visibleCells.length - 1) {
                      // We're on the rightmost visible cell - scroll right to show the next cell
                      tape.moveTapeRight();
                      
                      // Focus the new rightmost cell (which is the next cell)
                      requestAnimationFrame(() => {
                        const inputs = document.querySelectorAll('[data-tape-container] input');
                        const newRightmostInput = inputs[inputs.length - 1] as HTMLInputElement;
                        if (newRightmostInput) {
                          newRightmostInput.focus();
                          newRightmostInput.select();
                        }
                      });
                    }
                  }
                }}
                onFocus={(e) => {
                  e.target.select(); // Select all text when focused
                }}
                onContextMenu={(e: React.MouseEvent<HTMLInputElement>) => {
                  // Delegate right-click to show context menu
                  if (!machineExecution.isRunning) {
                    e.preventDefault();
                    setContextMenu(
                      contextMenu === null
                        ? {
                            mouseX: e.clientX + 2,
                            mouseY: e.clientY - 6,
                            cellId: cell.id,
                          }
                        : null
                    );
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'ArrowRight' && !e.shiftKey) {
                    e.preventDefault();
                    if (index < visibleCells.length - 1) {
                      const currentInput = e.target as HTMLInputElement;
                      const nextInput = currentInput.parentElement?.nextElementSibling?.querySelector('input') as HTMLInputElement;
                      if (nextInput) {
                        nextInput.focus();
                        nextInput.select();
                      }
                    } else if (index === visibleCells.length - 1) {
                      // We're on the rightmost visible cell - scroll right to show the next cell
                      tape.moveTapeRight();
                      
                      // Focus the new rightmost cell (which is the next cell)
                      requestAnimationFrame(() => {
                        const inputs = document.querySelectorAll('[data-tape-container] input');
                        const newRightmostInput = inputs[inputs.length - 1] as HTMLInputElement;
                        if (newRightmostInput) {
                          newRightmostInput.focus();
                          newRightmostInput.select();
                        }
                      });
                    }
                  } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
                    e.preventDefault();
                    if (index > 0) {
                      const currentInput = e.target as HTMLInputElement;
                      const prevInput = currentInput.parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement;
                      if (prevInput) {
                        prevInput.focus();
                        prevInput.select();
                      }
                    }
                  } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    if (index < visibleCells.length - 1) {
                      const currentInput = e.target as HTMLInputElement;
                      const nextInput = currentInput.parentElement?.nextElementSibling?.querySelector('input') as HTMLInputElement;
                      if (nextInput) {
                        nextInput.focus();
                        nextInput.select();
                      }
                    } else if (index === visibleCells.length - 1) {
                      // We're on the rightmost visible cell - scroll right to show the next cell
                      tape.moveTapeRight();
                      
                      // Focus the new rightmost cell (which is the next cell)
                      requestAnimationFrame(() => {
                        const inputs = document.querySelectorAll('[data-tape-container] input');
                        const newRightmostInput = inputs[inputs.length - 1] as HTMLInputElement;
                        if (newRightmostInput) {
                          newRightmostInput.focus();
                          newRightmostInput.select();
                        }
                      });
                    }
                  } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    const currentValue = cell.val === '∅' || !cell.val ? '' : cell.val;
                    
                    if (currentValue) {
                      // If current cell has content, clear it
                      tape.writeToCell(cell.id, '∅');
                    } else if (index > 0) {
                      // If current cell is empty, move to previous cell and clear it
                      const currentInput = e.target as HTMLInputElement;
                      const prevInput = currentInput.parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement;
                      if (prevInput) {
                        const prevCell = visibleCells[index - 1];
                        tape.writeToCell(prevCell.id, '∅');
                        prevInput.focus();
                        prevInput.select();
                      }
                    }
                  } else if (e.key === 'Delete') {
                    e.preventDefault();
                    // Delete always clears current cell
                    tape.writeToCell(cell.id, '∅');
                  }
                }}
                disabled={machineExecution.isRunning}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: machineExecution.isRunning ? 'default' : 'text',
                }}
              />
            </Box>
          ))}
        </Box>
        
        {/* Right Navigation */}
        <IconButton 
          onClick={() => tape.moveTapeRight()}
          disabled={machineExecution.isRunning}
          sx={{ ml: 1 }}
          title="Scroll tape right"
        >
          <KeyboardDoubleArrowRight />
        </IconButton>
      </Box>
      
      {/* Context Menu for Cell Actions */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (contextMenu) {
              tape.setHeadPosition(contextMenu.cellId);
              // Clear any current input focus
              (document.activeElement as HTMLElement)?.blur?.();
            }
            setContextMenu(null);
          }}
        >
          Move head here
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default TapeDisplay;