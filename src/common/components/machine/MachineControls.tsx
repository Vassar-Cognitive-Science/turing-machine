import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Slider,
  Button,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  SkipNext,
  Quiz,
  Undo,
  Redo,
  Save,
  Speed,
  FlashOn,
  RestartAlt,
} from '@mui/icons-material';

import { useMachineStore, useTapeStore, useMachineExecution, useUndoRedo } from '../../../stores';

interface MachineControlsProps {
  onPlay: () => void;
  onStop: () => void;
  onStep: () => void;
  onTurbo: () => void;
  onOpenDrawer: () => void;
  onSaveMachine: () => void;
}

export function MachineControls({
  onPlay,
  onStop,
  onStep,
  onTurbo,
  onOpenDrawer,
  onSaveMachine,
}: MachineControlsProps): React.ReactElement {
  const machine = useMachineStore();
  const tape = useTapeStore();
  const machineExecution = useMachineExecution();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ gap: 1, flexWrap: 'wrap', minHeight: 64 }}>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          Turing Machine Simulator
        </Typography>
        
        {/* Machine Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={onPlay}
            disabled={machineExecution.isRunning}
            title="Run with animation"
          >
            <PlayArrow />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onTurbo}
            disabled={machineExecution.isRunning}
            title="Turbo mode (no animation)"
          >
            <FlashOn />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onStop}
            disabled={!machineExecution.isRunning}
            title="Stop"
          >
            <Stop />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onStep}
            disabled={machineExecution.isRunning}
            title="Step"
          >
            <SkipNext />
          </IconButton>
        </Box>
        
        {/* Animation Speed Controls */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mx: 1 }}>
          <Speed color="inherit" />
          <Box sx={{ minWidth: 100 }}>
            <Slider
              value={(machine as any).animationSpeedFactor}
              onChange={(_, value) => (machine as any).setAnimationSpeed(value as number)}
              min={0.1}
              max={3.0}
              step={0.1}
              size="small"
              sx={{
                color: 'inherit',
                '& .MuiSlider-thumb': {
                  color: 'inherit',
                },
                '& .MuiSlider-track': {
                  color: 'inherit',
                },
                '& .MuiSlider-rail': {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ minWidth: 25, color: 'inherit', fontSize: '0.75rem' }}>
            {(machine as any).animationSpeedFactor.toFixed(1)}x
          </Typography>
        </Box>
        
        {/* Undo/Redo */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={undo} disabled={!canUndo} title="Undo">
            <Undo />
          </IconButton>
          <IconButton color="inherit" onClick={redo} disabled={!canRedo} title="Redo">
            <Redo />
          </IconButton>
        </Box>
        
        {/* Tape Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit"
            onClick={() => {
              machine.setCurrentRule(null); // Clear highlighting when user clears tape
              tape.fillTape('');
              tape.setManualState('START');
            }} 
            size="small"
            variant="outlined"
            disabled={machineExecution.isRunning}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white' }
            }}
            title="Clear tape content"
          >
            Clear Tape
          </Button>
          <Button 
            color="inherit"
            onClick={() => {
              machineExecution.reset();
            }} 
            size="small"
            variant="outlined"
            disabled={machineExecution.isRunning}
            startIcon={<RestartAlt />}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white' }
            }}
            title="Reset tape to initial state when machine last started"
          >
            Reset
          </Button>
        </Box>
        
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Save & Menu */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="inherit" 
            onClick={onSaveMachine}
            title="Save Machine to Database"
          >
            <Save />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={onOpenDrawer}
            title="Test Cases"
          >
            <Quiz />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default MachineControls;