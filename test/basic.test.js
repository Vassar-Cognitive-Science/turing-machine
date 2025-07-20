/**
 * Basic tests to verify test setup is working
 */

describe('Test Setup', () => {
  test('Jest is working correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('Test utilities are available', () => {
    expect(testUtils).toBeDefined();
    expect(testUtils.createSampleMachineState).toBeDefined();
    expect(testUtils.createMinimalMachineState).toBeDefined();
  });

  test('Can create sample machine state', () => {
    const state = testUtils.createSampleMachineState();
    
    expect(state).toBeDefined();
    expect(state.machine).toBeDefined();
    expect(state.tape).toBeDefined();
    expect(state.machine.currentState).toBe('q0');
    expect(state.tape.content).toBeDefined();
  });

  test('Can create minimal machine state', () => {
    const state = testUtils.createMinimalMachineState();
    
    expect(state).toBeDefined();
    expect(state.machine.states).toEqual(['q0']);
    expect(state.machine.rules).toEqual([]);
    expect(state.tape.content).toBe('');
  });

  test('Sample state can be customized', () => {
    const customState = testUtils.createSampleMachineState({
      machine: { currentState: 'q5' },
      tape: { content: 'custom' }
    });
    
    expect(customState.machine.currentState).toBe('q5');
    expect(customState.tape.content).toBe('custom');
  });
});