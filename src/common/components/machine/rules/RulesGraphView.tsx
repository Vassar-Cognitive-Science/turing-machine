import React from 'react';
import ReactFlowGraph from './ReactFlowGraph';

interface RulesGraphViewProps {
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
  onAddRule?: () => void;
}

export function RulesGraphView({
  onEditRule,
  onDeleteRule,
  onAddRule,
}: RulesGraphViewProps): React.ReactElement {
  return (
    <ReactFlowGraph
      onEditRule={onEditRule}
      onDeleteRule={onDeleteRule}
      onAddRule={onAddRule}
    />
  );
}

export default RulesGraphView;