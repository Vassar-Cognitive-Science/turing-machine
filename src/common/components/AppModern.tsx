import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';


import { 
  useMachineStore, 
  useTapeStore, 
  useGuiStore, 
  useTrialStore, 
  useMachineExecution, 
  useTapeOperations, 
  useTrialOperations, 
  initializeStores 
} from '../../stores';

import { TapeDisplay } from './machine/TapeDisplay';
import { RulesTable } from './machine/RulesTable';
import { MachineControls } from './machine/MachineControls';
import { TrialsDrawer } from './trials/TrialsDrawer';

import type { 
  NotificationState, 
  DialogState, 
  TrialDialogData, 
  SharedMachineState, 
  ShareResponse,
  Rule,
  Trial,
  VisibleCell
} from '../../types';

// Modern Turing Machine Simulator App
function AppModern(): React.ReactElement {
  const machine = useMachineStore();
  const tape = useTapeStore();
  const gui = useGuiStore();
  const trial = useTrialStore();
  const machineExecution = useMachineExecution();
  const tapeOps = useTapeOperations();
  const trialOps = useTrialOperations();

  // Local UI state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<NotificationState>({ open: false, message: '', severity: 'success' });
  const [errorDialog, setErrorDialog] = useState<DialogState>({ open: false, message: '' });
  const [newRuleDialog, setNewRuleDialog] = useState<boolean>(false);
  const [newTrialDialog, setNewTrialDialog] = useState<boolean>(false);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);

  const location = useLocation();
  const params = useParams<{ id?: string }>();

  // Initialize stores on mount
  useEffect(() => {
    initializeStores();
  }, []);

  // Watch for machine errors and display them in snackbar
  useEffect(() => {
    const machineErrorMessage = (machine as any).machineReportError;
    const showError = (machine as any).showReportedError;
    
    if (showError && machineErrorMessage) {
      setSnackbar({
        open: true,
        message: machineErrorMessage,
        severity: 'error'
      });
      // Clear the error after showing it
      (machine as any).clearError();
    }
  }, [(machine as any).machineReportError, (machine as any).showReportedError]);

  // Load machine state from URL parameter or preloaded state
  useEffect(() => {
    const loadMachineState = async () => {
      const preloadedState = (window as any).__PRELOADED_STATE__;
      
      // First, try to load from URL parameter
      if (params.id) {
        setIsLoadingState(true);
        try {
          const response = await fetch(`/api/state/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            loadSharedMachineState(data.state);
            setSnackbar({ 
              open: true, 
              message: 'Machine state loaded successfully!', 
              severity: 'success' 
            });
          } else {
            throw new Error('Machine state not found');
          }
        } catch (error) {
          console.error('Failed to load machine state from URL:', error);
          setErrorDialog({ 
            open: true, 
            message: `Failed to load machine state: ${(error as Error).message}` 
          });
        } finally {
          setIsLoadingState(false);
        }
      }
      // Fallback to preloaded state (for backward compatibility)
      else if (preloadedState && Object.keys(preloadedState).length > 0) {
        try {
          loadSharedMachineState(preloadedState);
          setSnackbar({ 
            open: true, 
            message: 'Machine state loaded successfully!', 
            severity: 'success' 
          });
        } catch (error) {
          console.error('Failed to load shared machine state:', error);
          setErrorDialog({ 
            open: true, 
            message: `Failed to load shared machine: ${(error as Error).message}` 
          });
        }
        // Clear the preloaded state to avoid reloading on subsequent renders
        (window as any).__PRELOADED_STATE__ = null;
      }
    };

    loadMachineState();
  }, [params.id]); // Re-run when URL parameter changes

  // Function to load shared machine state from server format
  const loadSharedMachineState = (serverState: SharedMachineState): void => {
    // Clear rule highlighting when loading shared machine state
    machine.setCurrentRule(null);
    
    // Clear existing rules
    machine.rowsById.forEach((ruleId: string) => machine.deleteRule(ruleId));
    
    // Load rules from server state
    const ruleIds = serverState.rowsById || [];
    ruleIds.forEach((ruleId) => {
      const ruleData = serverState[ruleId];
      if (ruleData) {
        machine.addRule();
        const newRuleIds = machine.rowsById;
        const newRuleId = newRuleIds[newRuleIds.length - 1];
        
        if (newRuleId) {
          machine.updateRule(newRuleId, 'in_state', ruleData.in_state || '');
          machine.updateRule(newRuleId, 'read', ruleData.read || '');
          machine.updateRule(newRuleId, 'write', ruleData.write || '');
          machine.updateRule(newRuleId, 'direction', ruleData.direction || 'R');
          machine.updateRule(newRuleId, 'new_state', ruleData.new_state || '');
        }
      }
    });
    
    // Load tape content from linked list structure
    const tapeCellsById = serverState.tapeCellsById || [];
    if (tapeCellsById.length > 0) {
      let tapeContent = '';
      let currentCellId = serverState.tapeHead;
      
      // Traverse the linked list to reconstruct tape content
      while (currentCellId) {
        const cellData = serverState[currentCellId];
        if (cellData) {
          tapeContent += cellData.val || '∅';
          currentCellId = cellData.next;
        } else {
          break;
        }
      }
      
      // Set tape content, filtering out empty symbols
      const cleanedTapeContent = tapeContent.replace(/∅+$/, '');
      tape.fillTape(cleanedTapeContent);
    } else {
      tape.fillTape('');
    }
    
    // Set internal state
    if (serverState.tapeInternalState) {
      tape.setInternalState(serverState.tapeInternalState);
    }
    
    // Clear execution history for fresh start
    (machine as any).clearHistory();
    
    setSnackbar({ 
      open: true, 
      message: 'Shared machine loaded successfully!', 
      severity: 'success' 
    });
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      gui.resizeScreenAndTape(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gui]);

  // Machine control handlers
  const handlePlay = (): void => {
    machineExecution.run();
  };

  const handleStop = (): void => {
    machineExecution.stop();
  };

  const handleStep = (): void => {
    machineExecution.step();
  };
  const handleTurbo = (): void => {
    machineExecution.runTurbo();
  };

  const handleAddRule = (): void => {
    machine.addRule();
    setSnackbar({ open: true, message: 'Rule added', severity: 'success' });
  };


  const handleShareMachine = async (): Promise<void> => {
    try {
      // Create machine state in the format expected by the original server
      const stateToSave: SharedMachineState = {
        // Convert new store format to original Redux-like format
        rowsById: machine.rowsById,
        tapeInternalState: tapeOps.currentState,
        stepCount: (machineExecution as any).stepCount,
        anyChangeInNormal: (machineExecution as any).stepCount > 0,
        
        // Add rule data
        ...machine.getAllRules().reduce((acc: any, rule: Rule) => {
          acc[rule.id] = {
            in_state: rule.in_state,
            read: rule.read,
            write: rule.write,
            direction: rule.direction,
            new_state: rule.new_state,
            isLeft: rule.direction === 'L'
          };
          return acc;
        }, {}),
        
        // Add trial data
        trials: (trial as any).getAllTrials ? (trial as any).getAllTrials() : [],
        
        // Add tape data - convert to original format
        tapeCellsById: [], // Will be populated based on tape content
        tapeHead: null,
        tapeTail: null,
        tapePointer: null,
        anchorCell: 0
      };

      // If there's tape content, create the linked list structure
      const tapeContent = tapeOps.tapeContent;
      if (tapeContent && tapeContent.length > 0) {
        const cellIds: string[] = [];
        tapeContent.split('').forEach((char: string, index: number) => {
          const cellId = `TAPE-CELL ${index}`;
          cellIds.push(cellId);
          stateToSave[cellId] = {
            val: char,
            prev: index > 0 ? cellIds[index - 1] : null,
            next: index < tapeContent.length - 1 ? null : null, // Will be set in next iteration
            highlight: false
          };
          
          // Set next pointer for previous cell
          if (index > 0) {
            stateToSave[cellIds[index - 1]].next = cellId;
          }
        });
        
        stateToSave.tapeCellsById = cellIds;
        stateToSave.tapeHead = cellIds[0];
        stateToSave.tapeTail = cellIds[cellIds.length - 1];
        stateToSave.tapePointer = cellIds[0]; // Head starts at beginning
      }

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stateToSave)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result: ShareResponse = await response.json();
      const shareUrl = `${window.location.origin}/${result.id}`;
      
      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setSnackbar({ 
          open: true, 
          message: `Machine saved! URL copied to clipboard: ${shareUrl}`, 
          severity: 'success' 
        });
      } else {
        // Fallback for older browsers
        setSnackbar({ 
          open: true, 
          message: `Machine saved! URL: ${shareUrl}`, 
          severity: 'success' 
        });
      }

    } catch (error) {
      console.error('Save error:', error);
      setErrorDialog({ 
        open: true, 
        message: `Failed to save machine: ${(error as Error).message}` 
      });
    }
  };


  const handleAddTrial = (): void => {
    setNewTrialDialog(true);
  };

  const handleCreateTrial = (trialData: TrialDialogData): void => {
    trialOps.createTrial(
      trialData.name || `Test Case #${(trial as any).testsById.length + 1}`,
      trialData.startTape || '',
      trialData.expectedTape || ''
    );
    setNewTrialDialog(false);
    setSnackbar({ open: true, message: 'Trial added', severity: 'success' });
  };

  const handleRunAllTrials = async (): Promise<void> => {
    try {
      await trialOps.runTrial();
      setSnackbar({ open: true, message: 'All trials completed', severity: 'info' });
    } catch (error) {
      setErrorDialog({ open: true, message: (error as Error).message });
    }
  };




  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Loading indicator when loading machine state from URL */}
      {isLoadingState && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          bgcolor: 'rgba(255, 255, 255, 0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999 
        }}>
          <Typography variant="h6">Loading machine state...</Typography>
        </Box>
      )}

      {/* Machine Controls */}
      <MachineControls 
        onPlay={handlePlay}
        onStop={handleStop}
        onStep={handleStep}
        onTurbo={handleTurbo}
        onOpenDrawer={() => setDrawerOpen(true)}
        onSaveMachine={handleShareMachine}
      />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        {/* Tape Display */}
        <TapeDisplay />

        {/* Rules Table */}
        <RulesTable 
          onAddRule={handleAddRule}
        />
      </Container>

      {/* Trials Drawer */}
      <TrialsDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRunAllTrials={handleRunAllTrials}
        onAddTrial={handleAddTrial}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onClose={() => setErrorDialog({ open: false, message: '' })}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({ open: false, message: '' })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Trial Dialog */}
      <Dialog open={newTrialDialog} onClose={() => setNewTrialDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Test Case</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Test Case Name"
              placeholder={`Test Case #${(trial as any).testsById.length + 1}`}
              sx={{ mb: 2 }}
              id="trial-name"
            />
            <TextField
              fullWidth
              label="Input Tape"
              placeholder="e.g., 110"
              helperText="Initial tape content for this test"
              sx={{ mb: 2 }}
              id="trial-input"
            />
            <TextField
              fullWidth
              label="Expected Output"
              placeholder="e.g., 111"
              helperText="Expected tape content after execution"
              sx={{ mb: 2 }}
              id="trial-output"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTrialDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              const nameElement = document.getElementById('trial-name') as HTMLInputElement;
              const startTapeElement = document.getElementById('trial-input') as HTMLInputElement;
              const expectedTapeElement = document.getElementById('trial-output') as HTMLInputElement;
              
              const name = nameElement?.value || '';
              const startTape = startTapeElement?.value || '';
              const expectedTape = expectedTapeElement?.value || '';
              
              handleCreateTrial({ name, startTape, expectedTape });
            }}
            variant="contained"
          >
            Create Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AppModern;