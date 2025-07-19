import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Add,
  Delete,
  DragIndicator,
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
}

function SortableRuleRow({ rule, machine }: SortableRuleRowProps): React.ReactElement {
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
      <Grid size={1} ref={setNodeRef} style={style}>
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
          placeholder="∅"
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

export function RulesTable({
  onAddRule,
}: RulesTableProps): React.ReactElement {
  const machine = useMachineStore();
  const rules = machine.getAllRules();
  const [currentView, setCurrentView] = useState<RulesViewType>('table');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      machine.reorderRules(active.id as string, over.id as string);
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
            onClick={machine.clearAllRules} 
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
              <Grid size={1}><Typography variant="body2" fontWeight="bold">Order</Typography></Grid>
              <Grid size={2}><Typography variant="body2" fontWeight="bold">State</Typography></Grid>
              <Grid size={2}><Typography variant="body2" fontWeight="bold">Read</Typography></Grid>
              <Grid size={2}><Typography variant="body2" fontWeight="bold">Write</Typography></Grid>
              <Grid size={2}><Typography variant="body2" fontWeight="bold">Move</Typography></Grid>
              <Grid size={2}><Typography variant="body2" fontWeight="bold">New State</Typography></Grid>
              <Grid size={1}><Typography variant="body2" fontWeight="bold">Actions</Typography></Grid>
              
              <SortableContext items={rules.map(rule => rule.id)} strategy={verticalListSortingStrategy}>
                {rules.map((rule: Rule) => (
                  <SortableRuleRow key={rule.id} rule={rule} machine={machine} />
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
    </Paper>
  );
}

export default RulesTable;