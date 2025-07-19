import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { TableRows, AccountTree } from '@mui/icons-material';

export type RulesViewType = 'table' | 'graph';

interface RulesViewSwitcherProps {
  currentView: RulesViewType;
  onViewChange: (view: RulesViewType) => void;
  disabled?: boolean;
}

export function RulesViewSwitcher({
  currentView,
  onViewChange,
  disabled = false,
}: RulesViewSwitcherProps): React.ReactElement {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: RulesViewType | null,
  ) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ToggleButtonGroup
        value={currentView}
        exclusive
        onChange={handleChange}
        size="medium"
        disabled={disabled}
        aria-label="rules view mode"
      >
        <ToggleButton 
          value="table" 
          aria-label="table view"
          title="Table View - Edit rules in a structured table format"
        >
          <TableRows />
          Table
        </ToggleButton>
        <ToggleButton 
          value="graph" 
          aria-label="graph view"
          title="Graph View - Visualize rules as a state diagram"
        >
          <AccountTree />
          Graph
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default RulesViewSwitcher;