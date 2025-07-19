import type { MachineStore, TapeStore } from '../../types';

export interface ExampleNotification {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}
