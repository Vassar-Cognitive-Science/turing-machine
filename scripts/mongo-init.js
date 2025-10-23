// MongoDB initialization script for development
// This script runs when the MongoDB container starts for the first time

// Switch to the turingMachine database
db = db.getSiblingDB('turingMachine');

// Create the saves collection with proper indexing
db.createCollection('saves');

// Create index on id field for faster lookups
db.saves.createIndex({ "id": 1 }, { unique: true });

// Create index on creation timestamp for cleanup/maintenance
db.saves.createIndex({ "_id": 1 });

// Insert some sample test data for development
db.saves.insertMany([
  {
    id: "test123",
    state: {
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
        ]
      },
      tape: {
        content: "0110",
        headPosition: 0
      }
    },
    createdAt: new Date()
  },
  {
    id: "sample456",
    state: {
      machine: {
        currentState: "q0",
        states: ["q0", "q1"],
        alphabet: ["a", "b", "_"],
        tapeAlphabet: ["a", "b", "_"],
        startState: "q0",
        acceptStates: ["q1"],
        rejectStates: [],
        rules: [
          {
            id: "rule1",
            from: "q0",
            read: "a",
            to: "q1",
            write: "b",
            direction: "R"
          }
        ]
      },
      tape: {
        content: "aabb",
        headPosition: 0
      }
    },
    createdAt: new Date()
  }
]);

print("MongoDB initialized successfully for Turing Machine development");
print("Created 'saves' collection with indexes and sample data");
print("Sample URLs available:");
print("  - http://localhost:3001/test123");
print("  - http://localhost:3001/sample456");