import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Delete,
  DragIndicator,
  ArrowUpward,
  ArrowDownward,
  Sort,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useMachineStore } from '../../../stores';
import type { Rule } from '../../../types';
import { RulesViewSwitcher, type RulesViewType } from './rules/RulesViewSwitcher';
import { RulesGraphView } from './rules/RulesGraphView';

interface RulesTableProps {
  onAddRule: () => void;
}

interface SortableRuleRowProps {
  rule: Rule;
  machine: any;
  rowNumber: number;
}

function SortableRuleRow({ rule, machine, rowNumber }: SortableRuleRowProps): React.ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <React.Fragment>
      <Grid size={0.5}>
        <Typography variant="body2" sx={{ pt: 2, textAlign: 'center', color: 'text.secondary' }}>
          {rowNumber}
        </Typography>
      </Grid>
      <Grid size={0.5} ref={setNodeRef} style={style}>
        <IconButton
          size="small"
          sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
          {...attributes}
          {...listeners}
        >
          <DragIndicator />
        </IconButton>
      </Grid>
      <Grid size={2}>
        <TextField
          size="medium"
          value={rule.in_state}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => machine.updateRule(rule.id, 'in_state', e.target.value)}
          placeholder="START"
        />
      </Grid>
      <Grid size={2}>
        <TextField
          size="medium"
          value={rule.read}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => machine.updateRule(rule.id, 'read', e.target.value)}
          placeholder="#"
          slotProps={{ htmlInput: { maxLength: 1 } }}
        />
      </Grid>
      <Grid size={2}>
        <TextField
          size="medium"
          value={rule.write}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => machine.updateRule(rule.id, 'write', e.target.value)}
          placeholder="1"
          slotProps={{ htmlInput: { maxLength: 1 } }}
        />
      </Grid>
      <Grid size={2}>
        <TextField
          size="medium"
          select
          value={rule.direction}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => machine.updateRule(rule.id, 'direction', e.target.value)}
          slotProps={{ select: { native: true } }}
        >
          <option value="R">Right</option>
          <option value="L">Left</option>
        </TextField>
      </Grid>
      <Grid size={2}>
        <TextField
          size="medium"
          value={rule.new_state}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => machine.updateRule(rule.id, 'new_state', e.target.value)}
          placeholder="halt"
        />
      </Grid>
      <Grid size={1}>
        <IconButton
          size="medium"
          onClick={() => machine.deleteRule(rule.id)}
          color="error"
        >
          <Delete />
        </IconButton>
      </Grid>
    </React.Fragment>
  );
}

type SortField = 'in_state' | 'new_state' | 'none';
type SortDirection = 'asc' | 'desc';

export function RulesTable({
  onAddRule,
}: RulesTableProps): React.ReactElement {
  const machine = useMachineStore();
  const rules = machine.getAllRules();
  const [currentView, setCurrentView] = useState<RulesViewType>('table');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [displayRules, setDisplayRules] = useState<Rule[]>([]);
  
  // Update displayRules when rules change or when sorting is applied
  useEffect(() => {
    if (sortField === 'none') {
      setDisplayRules(rules);
    } else {
      const sorted = [...rules].sort((a, b) => {
        const fieldA = a[sortField].toLowerCase();
        const fieldB = b[sortField].toLowerCase();
        
        if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setDisplayRules(sorted);
    }
  }, [rules, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If same field clicked again, cycle: asc -> desc -> none (manual order)
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField('none');
        setSortDirection('asc');
      }
    } else {
      // New field clicked, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <Sort fontSize="small" />;
    return sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Update the local displayRules state to reflect the new order
      const oldIndex = displayRules.findIndex(rule => rule.id === active.id);
      const newIndex = displayRules.findIndex(rule => rule.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newDisplayRules = [...displayRules];
        const [reorderedRule] = newDisplayRules.splice(oldIndex, 1);
        newDisplayRules.splice(newIndex, 0, reorderedRule);
        setDisplayRules(newDisplayRules);
        
        // Clear sorting since user is manually reordering
        setSortField('none');
        
        // Update the store with the new order (based on current displayRules, not original order)
        machine.loadRules(newDisplayRules);
      }
    }
  };
  
  const handleEditRule = (ruleId: string) => {
    // For now, just highlight the rule in table view
    // Future: Could open an editor dialog
    setCurrentView('table');
    console.log('Edit rule:', ruleId);
  };

  const handleDeleteRule = (ruleId: string) => {
    machine.deleteRule(ruleId);
  };

  const handleClearAllRules = () => {
    setClearConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    machine.clearAllRules();
    setClearConfirmOpen(false);
  };

  const handleCancelClear = () => {
    setClearConfirmOpen(false);
  };
  
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RulesViewSwitcher
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Add />} onClick={onAddRule} variant="outlined" size="medium">
            Add Rule
          </Button>
          <Button 
            onClick={machine.addSeedRules} 
            variant="outlined" 
            size="medium"
            color="success"
          >
            Load Test Rules
          </Button>
          <Button 
            onClick={handleClearAllRules} 
            variant="outlined" 
            size="medium"
            color="warning"
          >
            Clear All
          </Button>
        </Box>
      </Box>
      
      {currentView === 'table' ? (
        // Table View
        rules.length === 0 ? (
          <Typography color="text.secondary" align="center">
            No rules defined. Add a rule to get started.
          </Typography>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Grid container spacing={1}>
              <Grid size={0.5} sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" fontWeight="bold">#</Typography></Grid>
              <Grid size={0.5} sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" fontWeight="bold">Order</Typography></Grid>
              <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleSort('in_state')}
                  endIcon={getSortIcon('in_state')}
                  sx={{ 
                    '&.MuiButton-root': {
                      textTransform: 'none', 
                      fontWeight: 600,
                      fontSize: '1rem',
                      lineHeight: 1.43,
                      minWidth: 'auto',
                      minHeight: 'auto',
                      margin: 0,
                      padding: 0,
                      color: 'text.primary',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    },
                    '& .MuiButton-endIcon': {
                      marginLeft: 0.5,
                      marginRight: 0
                    }
                  }}
                >
                  State
                </Button>
              </Grid>
              <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" fontWeight="bold">Read</Typography></Grid>
              <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" fontWeight="bold">Write</Typography></Grid>
              <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}><Typography variant="body2" fontWeight="bold">Move</Typography></Grid>
              <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleSort('new_state')}
                  endIcon={getSortIcon('new_state')}
                  sx={{ 
                    '&.MuiButton-root': {
                      textTransform: 'none', 
                      fontWeight: 600,
                      fontSize: '1rem',
                      lineHeight: 1.43,
                      minWidth: 'auto',
                      minHeight: 'auto',
                      margin: 0,
                      padding: 0,
                      color: 'text.primary',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    },
                    '& .MuiButton-endIcon': {
                      marginLeft: 0.5,
                      marginRight: 0
                    }
                  }}
                >
                  New State
                </Button>
              </Grid>
              <Grid size={1}><Typography variant="body2" fontWeight="bold">Actions</Typography></Grid>
              
              <SortableContext items={displayRules.map(rule => rule.id)} strategy={verticalListSortingStrategy}>
                {displayRules.map((rule: Rule, index: number) => (
                  <SortableRuleRow key={rule.id} rule={rule} machine={machine} rowNumber={index + 1} />
                ))}
              </SortableContext>
            </Grid>
          </DndContext>
        )
      ) : (
        // Graph View
        <RulesGraphView
          onEditRule={handleEditRule}
          onDeleteRule={handleDeleteRule}
          onAddRule={onAddRule}
        />
      )}

      <Dialog
        open={clearConfirmOpen}
        onClose={handleCancelClear}
        aria-labelledby="clear-confirm-dialog-title"
        aria-describedby="clear-confirm-dialog-description"
      >
        <DialogTitle id="clear-confirm-dialog-title">
          Clear All Rules
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-confirm-dialog-description">
            Are you sure you want to clear all rules? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmClear} color="warning" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default RulesTable;