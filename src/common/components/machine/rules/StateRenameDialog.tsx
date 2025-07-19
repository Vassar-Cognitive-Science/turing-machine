import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from '@mui/material';
import { useMachineStore } from '../../../../stores';

interface StateRenameDialogProps {
  open: boolean;
  onClose: () => void;
  currentStateName: string;
  onSave: (newStateName: string, stateType: 'normal' | 'start' | 'halt') => void;
}

export function StateRenameDialog({
  open,
  onClose,
  currentStateName,
  onSave,
}: StateRenameDialogProps): React.ReactElement {
  const [stateName, setStateName] = useState('');
  const [stateType, setStateType] = useState<'normal' | 'start' | 'halt'>('normal');
  const [error, setError] = useState('');

  const machine = useMachineStore();

  useEffect(() => {
    if (open) {
      setStateName(currentStateName || '');
      // Determine current state type
      if (currentStateName && currentStateName.toUpperCase() === 'START') {
        setStateType('start');
      } else if (currentStateName && currentStateName.toUpperCase() === 'HALT') {
        setStateType('halt');
      } else {
        setStateType('normal');
      }
    }
    setError('');
  }, [open, currentStateName]);

  const validateStateName = (name: string) => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      return 'State name is required';
    }
    
    if (trimmedName.length > 20) {
      return 'State name must be 20 characters or less';
    }
    
    if (trimmedName !== currentStateName) {
      const existingStates = machine.getStateNames();
      if (existingStates.includes(trimmedName.toUpperCase())) {
        return 'A state with this name already exists';
      }
    }
    
    return '';
  };

  const handleSave = () => {
    const errorMessage = validateStateName(stateName);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    let finalStateName = stateName.trim();
    
    // Apply special naming for start/halt states
    if (stateType === 'start') {
      finalStateName = 'START';
    } else if (stateType === 'halt') {
      finalStateName = 'HALT';
    }

    onSave(finalStateName, stateType);
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {currentStateName && currentStateName.match(/^S\d+$/) ? 'Create New State' : currentStateName ? 'Rename State' : 'Create New State'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="State Name"
            value={stateName}
            onChange={(e) => {
              setStateName(e.target.value);
              setError('');
            }}
            error={Boolean(error)}
            helperText={error || 'Enter a unique name for this state'}
            fullWidth
            autoFocus
            inputProps={{ maxLength: 20 }}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">State Type</FormLabel>
            <RadioGroup
              value={stateType}
              onChange={(e) => setStateType(e.target.value as 'normal' | 'start' | 'halt')}
              row
            >
              <FormControlLabel 
                value="normal" 
                control={<Radio />} 
                label="Normal State" 
              />
              <FormControlLabel 
                value="start" 
                control={<Radio />} 
                label="Start State" 
              />
              <FormControlLabel 
                value="halt" 
                control={<Radio />} 
                label="Halt State" 
              />
            </RadioGroup>
          </FormControl>

          {stateType === 'start' && (
            <Typography variant="body2" color="info.main">
              This will be the initial state of the machine.
            </Typography>
          )}
          
          {stateType === 'halt' && (
            <Typography variant="body2" color="warning.main">
              This will be a terminal state where the machine stops.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {currentStateName ? 'Rename State' : 'Create State'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StateRenameDialog;