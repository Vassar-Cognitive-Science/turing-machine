import React, { useState, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  PlaylistPlay,
  Add,
  FileUpload,
  FileDownload,
  DeleteSweep,
} from '@mui/icons-material';

import { useTrialStore } from '../../../stores/trialStore';
import { TrialDetails } from './TrialDetails';
import { TrialEditor } from './TrialEditor';

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
  const {
    getTrialStats,
    isRunningTrial,
    exportTrialsAsYAML,
    importTrialsFromYAML,
    loadTrialToTape,
    clearAllTrials,
    getTrial,
  } = useTrialStore();

  // Subscribe to testsById which changes when trials are added/removed
  const testsById = useTrialStore((state) => state.testsById);

  // Fetch trials using getTrial for each ID when testsById changes
  const trials = React.useMemo(() => {
    console.log('TrialsDrawer: testsById changed:', testsById);
    const fetchedTrials = testsById.map((id) => getTrial(id)).filter((t): t is NonNullable<typeof t> => t !== null);
    console.log('TrialsDrawer: fetched trials:', fetchedTrials);
    return fetchedTrials;
  }, [testsById, getTrial]);

  const stats = getTrialStats();
  
  const [editingTrialId, setEditingTrialId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' | 'info' }>({ message: '', severity: 'info' });
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportYAML = () => {
    try {
      exportTrialsAsYAML();
      setNotification({
        message: 'Tests exported successfully',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to export tests',
        severity: 'error'
      });
    }
  };
  
  const handleImportYAML = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const result = importTrialsFromYAML(content);
        setNotification({
          message: result.message,
          severity: result.success ? 'success' : 'error'
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const handleClearAllTests = () => {
    setClearAllDialogOpen(true);
  };

  const handleConfirmClearAll = () => {
    clearAllTrials();
    setClearAllDialogOpen(false);
    setNotification({
      message: `All ${stats.total} test cases have been deleted`,
      severity: 'success'
    });
  };

  const handleCancelClearAll = () => {
    setClearAllDialogOpen(false);
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: 420, maxWidth: '90vw' } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Cases
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`${stats.total} Total`} size="small" />
          <Chip label={`${stats.passed} Passed`} color="success" size="small" />
          <Chip label={`${stats.failed} Failed`} color="error" size="small" />
          {stats.errors > 0 && (
            <Chip label={`${stats.errors} Errors`} color="warning" size="small" />
          )}
        </Stack>
        
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlaylistPlay />}
            onClick={onRunAllTrials}
            disabled={isRunningTrial}
            sx={{ mb: 1 }}
          >
            {isRunningTrial ? 'Running...' : 'Run All'}
          </Button>
          
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={onAddTrial}
            >
              Add Test
            </Button>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FileUpload />}
              onClick={handleImportYAML}
              size="small"
            >
              Import
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportYAML}
              size="small"
            >
              Export
            </Button>
          </Stack>
          
          {trials.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<DeleteSweep />}
              onClick={handleClearAllTests}
              size="small"
              sx={{ mt: 1 }}
            >
              Clear All Tests
            </Button>
          )}
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box>
          {trials.map((trial) => (
            <TrialDetails
              key={trial.id}
              trialId={trial.id}
              onEdit={(trialId) => setEditingTrialId(trialId)}
              onLoadToTape={(trialId) => {
                const success = loadTrialToTape(trialId);
                const trialName = trials.find(t => t.id === trialId)?.name || 'trial';
                setNotification({
                  message: success 
                    ? `Loaded "${trialName}" to tape successfully` 
                    : 'Failed to load trial to tape',
                  severity: success ? 'success' : 'error'
                });
              }}
            />
          ))}
          {trials.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="textSecondary">
                No test cases
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Add a test case to get started
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Hidden file input for YAML import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".yaml,.yml"
        onChange={handleFileSelect}
      />
      
      {/* Trial Editor Dialog */}
      <TrialEditor
        open={Boolean(editingTrialId)}
        trialId={editingTrialId}
        onClose={() => setEditingTrialId(null)}
        onSave={() => {
          setEditingTrialId(null);
          setNotification({
            message: 'Trial updated successfully',
            severity: 'success'
          });
        }}
      />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={Boolean(notification.message)}
        autoHideDuration={4000}
        onClose={() => setNotification({ message: '', severity: 'info' })}
      >
        <Alert 
          severity={notification.severity} 
          onClose={() => setNotification({ message: '', severity: 'info' })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={clearAllDialogOpen}
        onClose={handleCancelClearAll}
        aria-labelledby="clear-all-dialog-title"
        aria-describedby="clear-all-dialog-description"
      >
        <DialogTitle id="clear-all-dialog-title">
          Clear All Test Cases?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-all-dialog-description">
            Are you sure you want to delete all {stats.total} test case{stats.total !== 1 ? 's' : ''}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClearAll} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmClearAll} color="error" variant="contained" autoFocus>
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

export default TrialsDrawer;