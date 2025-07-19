import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Rule } from '../../../../types';
import { useMachineStore } from '../../../../stores';

interface RuleEditDialogProps {
  open: boolean;
  onClose: () => void;
  rule?: Rule | null;
  sourceState?: string;
  targetState?: string;
  onSave: (ruleData: { read: string; write: string; direction: 'L' | 'R' }) => void;
}

export function RuleEditDialog({
  open,
  onClose,
  rule,
  sourceState,
  targetState,
  onSave,
}: RuleEditDialogProps): React.ReactElement {
  const [read, setRead] = useState('');
  const [write, setWrite] = useState('');
  const [direction, setDirection] = useState<'L' | 'R'>('R');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const machine = useMachineStore();

  // Initialize form values
  useEffect(() => {
    if (rule) {
      setRead(rule.read || '');
      setWrite(rule.write || '');
      setDirection(rule.direction || 'R');
    } else {
      setRead('');
      setWrite('');
      setDirection('R');
    }
    setErrors({});
  }, [rule, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!read.trim()) {
      newErrors.read = 'Read symbol is required (use # for blank)';
    }

    if (!write.trim()) {
      newErrors.write = 'Write symbol is required (use # for blank)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const ruleData = {
      read: read.trim(),
      write: write.trim(),
      direction,
    };

    if (rule) {
      // Update existing rule
      machine.updateRule(rule.id, 'read', ruleData.read);
      machine.updateRule(rule.id, 'write', ruleData.write);
      machine.updateRule(rule.id, 'direction', ruleData.direction);
    } else {
      // Create new rule (handled by parent)
      onSave(ruleData);
    }

    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const isEditMode = Boolean(rule);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edit Transition Rule' : 'Create New Transition Rule'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Transition
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={sourceState || rule?.in_state || 'Source'} 
              color="primary" 
              variant="outlined"
            />
            <Typography variant="body2">→</Typography>
            <Chip 
              label={targetState || rule?.new_state || 'Target'} 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Read Symbol"
            value={read}
            onChange={(e) => setRead(e.target.value)}
            placeholder="Enter symbol to read (use # for blank)"
            error={Boolean(errors.read)}
            helperText={errors.read || 'Symbol that triggers this transition'}
            fullWidth
            inputProps={{ maxLength: 10 }}
          />

          <TextField
            label="Write Symbol"
            value={write}
            onChange={(e) => setWrite(e.target.value)}
            placeholder="Enter symbol to write (use # for blank)"
            error={Boolean(errors.write)}
            helperText={errors.write || 'Symbol to write to the tape'}
            fullWidth
            inputProps={{ maxLength: 10 }}
          />

          <FormControl fullWidth>
            <InputLabel>Direction</InputLabel>
            <Select
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'L' | 'R')}
              label="Direction"
            >
              <MenuItem value="L">Left (L)</MenuItem>
              <MenuItem value="R">Right (R)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Rule Summary:</strong> When in state "{sourceState || rule?.in_state}" 
            and reading "{read || '#'}", write "{write || '#'}", 
            move {direction === 'L' ? 'left' : 'right'}, 
            and transition to state "{targetState || rule?.new_state}".
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditMode ? 'Update Rule' : 'Create Rule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RuleEditDialog;