/**
 * Jest test setup file
 * Configures global test environment and utilities
 */

// Mock console.warn in tests to reduce noise
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = () => {}; // Silent mock instead of jest.fn()
});

afterEach(() => {
  console.warn = originalWarn;
});

// Global test utilities
global.testUtils = {
  // Create a sample machine state for testing
  createSampleMachineState: (overrides = {}) => ({
    machine: {
      currentState: "q0",
      states: ["q0", "q1", "q2"],
      alphabet: ["0", "1", "_"],
      tapeAlphabet: ["0", "1", "_"],
      startState: "q0",
      acceptStates: ["q2"],
      rejectStates: [],
      rules: [
        {
          id: "rule1",
          from: "q0",
          read: "0",
          to: "q1", 
          write: "1",
          direction: "R"
        }
      ],
      ...overrides.machine
    },
    tape: {
      content: "0110",
      headPosition: 0,
      ...overrides.tape
    },
    ...overrides
  }),

  // Create a minimal machine state
  createMinimalMachineState: () => ({
    machine: {
      currentState: "q0",
      states: ["q0"],
      alphabet: ["_"],
      rules: []
    },
    tape: {
      content: "",
      headPosition: 0
    }
  }),

  // Wait for a specified number of milliseconds
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

// Check if MongoDB is available for integration tests
global.isMongoAvailable = async () => {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient("mongodb://localhost:27017", {
      serverSelectionTimeoutMS: 1000,
      connectTimeoutMS: 1000
    });
    await client.connect();
    await client.close();
    return true;
  } catch (error) {
    return false;
  }
};