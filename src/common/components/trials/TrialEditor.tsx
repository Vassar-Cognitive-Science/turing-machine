import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
} from '@mui/material';
import { useTrialStore } from '../../../stores/trialStore';

interface TrialEditorProps {
  open: boolean;
  trialId: string | null;
  onClose: () => void;
  onSave: () => void;
}

export const TrialEditor: React.FC<TrialEditorProps> = ({
  open,
  trialId,
  onClose,
  onSave,
}) => {
  const { getTrial, updateTrial } = useTrialStore();
  
  const [formData, setFormData] = useState({
    name: '',
    startState: '0',
    startTape: '',
    expectedTape: '',
    tapePointer: 0,
    expectedTapePointer: 0,
    startTapeHead: 0,
    expectedTapeHead: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && trialId) {
      const trial = getTrial(trialId);
      if (trial) {
        setFormData({
          name: trial.name,
          startState: trial.startState,
          startTape: trial.startTape,
          expectedTape: trial.expectedTape,
          tapePointer: trial.tapePointer,
          expectedTapePointer: trial.expectedTapePointer,
          startTapeHead: trial.startTapeHead,
          expectedTapeHead: trial.expectedTapeHead,
        });
      }
    }
  }, [open, trialId, getTrial]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Test name is required';
    }

    if (!formData.startState.trim()) {
      newErrors.startState = 'Start state is required';
    }

    // Additional validation can be added here
    if (formData.startTapeHead < 0) {
      newErrors.startTapeHead = 'Head position must be non-negative';
    }

    if (formData.expectedTapeHead < 0) {
      newErrors.expectedTapeHead = 'Expected head position must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm() || !trialId) return;

    updateTrial(trialId, formData);
    onSave();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Edit Test Case</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Test Name */}
          <TextField
            fullWidth
            label="Test Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          {/* Start State and Head Position */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Start State"
              value={formData.startState}
              onChange={(e) => handleInputChange('startState', e.target.value)}
              error={!!errors.startState}
              helperText={errors.startState || 'Initial machine state'}
              required
            />

            <TextField
              fullWidth
              type="number"
              label="Start Head Position"
              value={formData.startTapeHead}
              onChange={(e) => handleInputChange('startTapeHead', parseInt(e.target.value) || 0)}
              error={!!errors.startTapeHead}
              helperText={errors.startTapeHead || 'Initial tape head position'}
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Start Tape Content */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Start Tape Content"
            value={formData.startTape}
            onChange={(e) => handleInputChange('startTape', e.target.value)}
            helperText="Initial tape content (use # for blank cells)"
          />

          {/* Expected Tape Output */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Expected Tape Output"
            value={formData.expectedTape}
            onChange={(e) => handleInputChange('expectedTape', e.target.value)}
            helperText="Expected final tape content after execution (only this is compared)"
          />
        </Stack>

        {/* Help Text */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Tips:</strong>
            <br />• Use # to represent blank cells on the tape
            <br />• Head position is where the read/write head starts (0-indexed)
            <br />• <strong>Only tape content is compared for pass/fail</strong>
            <br />• Leading/trailing blanks are ignored in comparison
            <br />• Tests run in turbo mode (maximum speed, no visual delays)
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!trialId}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};