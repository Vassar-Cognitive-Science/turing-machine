import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Cached as RunningIcon,
} from '@mui/icons-material';
import { useTrialStore } from '../../../stores/trialStore';

interface TrialDetailsProps {
  trialId: string;
  onEdit: (trialId: string) => void;
  onLoadToTape: (trialId: string) => void;
}

export const TrialDetails: React.FC<TrialDetailsProps> = ({
  trialId,
  onEdit,
  onLoadToTape,
}) => {
  const { getTrial, runTrial, isTrialRunning } = useTrialStore();
  const trial = getTrial(trialId);
  const [expanded, setExpanded] = useState(false);

  if (!trial) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'running':
        return <RunningIcon color="info" />;
      default:
        return <PendingIcon color="disabled" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      case 'error':
        return 'error';
      case 'running':
        return 'info';
      default:
        return 'default';
    }
  };


  const handleRunTrial = () => {
    runTrial(trialId);
  };

  const handleLoadToTape = () => {
    onLoadToTape(trialId);
  };

  const isRunning = isTrialRunning(trialId);

  return (
    <Accordion 
      expanded={expanded} 
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{ mb: 1 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mr: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {getStatusIcon(trial.status)}
            <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
              {trial.name}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={trial.status.toUpperCase()} 
              color={getStatusColor(trial.status) as any}
              size="small"
            />
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<PlayIcon />}
              onClick={handleRunTrial}
              disabled={isRunning}
              variant="contained"
              size="small"
              fullWidth
            >
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleLoadToTape}
              variant="outlined"
              size="small"
              fullWidth
            >
              Load
            </Button>
            
            <Button
              startIcon={<EditIcon />}
              onClick={() => onEdit(trialId)}
              variant="outlined"
              size="small"
              fullWidth
            >
              Edit
            </Button>
          </Stack>

          {/* Test Configuration */}
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'medium' }}>
              Configuration
            </Typography>
            
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Start State:
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {trial.startState}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, minWidth: '200px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Start Head Position:
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {trial.startTapeHead}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Start Tape:
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    backgroundColor: 'grey.100', 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    wordBreak: 'break-all'
                  }}
                >
                  {trial.startTape || '(empty)'}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Expected Tape Output:
                </Typography>
                <Box 
                  sx={{ 
                    p: 1, 
                    backgroundColor: 'success.light', 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    wordBreak: 'break-all',
                    opacity: 0.8
                  }}
                >
                  {trial.expectedTape || '(empty)'}
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Execution Results */}
          {trial.result && (
            <Paper sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'medium' }}>
                Results
              </Typography>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 100px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Status:
                    </Typography>
                    <Chip 
                      label={trial.status.toUpperCase()} 
                      color={getStatusColor(trial.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ flex: '1 1 100px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Steps:
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {trial.steps}
                    </Typography>
                  </Box>
                </Box>

                {/* Error Details - Show prominently for failed tests */}
                {trial.error && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="error.main" fontWeight="medium">
                      Error Details:
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        backgroundColor: 'error.light',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        mt: 1,
                        opacity: 0.9,
                        border: '1px solid',
                        borderColor: 'error.main'
                      }}
                    >
                      {trial.error}
                    </Box>
                  </Box>
                )}
                
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Actual Output:
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 1, 
                      backgroundColor: trial.status === 'passed' ? 'success.light' : 'error.light',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all',
                      opacity: 0.8
                    }}
                  >
                    {trial.actualOutput || '(empty)'}
                  </Box>
                </Box>
              </Stack>
            </Paper>
          )}

        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};