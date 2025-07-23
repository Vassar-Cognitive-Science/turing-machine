import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Chip,
  Box,
  Alert,
} from '@mui/material';

import { useMachineStore, useMachineExecution, useTapeOperations } from '../../../stores';

export function StatusBar(): React.ReactElement {
  const machine = useMachineStore();
  const machineExecution = useMachineExecution();
  const tapeOps = useTapeOperations();

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" component="div">
            <strong>Machine Status:</strong> 
            <Chip 
              label={machineExecution.isRunning ? 'Running' : 'Stopped'} 
              color={machineExecution.isRunning ? 'success' : 'default'}
              size="medium"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2">
            <strong>Steps:</strong> {(machineExecution as any).stepCount}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" component="div">
            <strong>State:</strong> 
            <Chip 
              label={machineExecution.currentState || 'START'} 
              color="primary"
              size="medium"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Typography variant="body2" component="div">
            <strong>Symbol:</strong> 
            <Chip 
              label={tapeOps.currentSymbol || '#'} 
              variant="outlined"
              size="medium"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Grid>
      </Grid>
      
      {/* Error display */}
      {(machine as any).showReportedError && (machine as any).machineReportError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" onClose={() => (machine as any).clearError()}>
            {(machine as any).machineReportError}
          </Alert>
        </Box>
      )}
    </Paper>
  );
}

export default StatusBar;