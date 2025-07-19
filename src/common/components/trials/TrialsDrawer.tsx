import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  PlaylistPlay,
  Add,
} from '@mui/icons-material';

import { useTrialOperations } from '../../../stores';
import type { Trial } from '../../../types';

interface TrialsDrawerProps {
  open: boolean;
  onClose: () => void;
  onRunAllTrials: () => void;
  onAddTrial: () => void;
}

export function TrialsDrawer({
  open,
  onClose,
  onRunAllTrials,
  onAddTrial,
}: TrialsDrawerProps): React.ReactElement {
  const trialOps = useTrialOperations();
  const trials = trialOps.trials;
  const stats = trialOps.stats;
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: 320 } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Cases
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={`${stats.total} Total`} size="medium" />
          <Chip label={`${stats.passed} Passed`} color="success" size="medium" />
          <Chip label={`${stats.failed} Failed`} color="error" size="medium" />
        </Stack>
        
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlaylistPlay />}
            onClick={onRunAllTrials}
            disabled={trialOps.isRunning}
            sx={{ mb: 1 }}
          >
            {trialOps.isRunning ? 'Running...' : 'Run All Tests'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={onAddTrial}
          >
            Add Test
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {trials.map((trial: Trial) => (
            <ListItem key={trial.id}>
              <ListItemText
                primary={trial.name}
                secondary={`Status: ${trial.status}`}
              />
              <Chip
                label={trial.status}
                color={
                  trial.status === 'passed' ? 'success' :
                  trial.status === 'failed' ? 'error' :
                  trial.status === 'running' ? 'warning' : 'default'
                }
                size="medium"
              />
            </ListItem>
          ))}
          {trials.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No test cases"
                secondary="Add a test case to get started"
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export default TrialsDrawer;