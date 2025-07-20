/**
 * Integration tests for save/load API endpoints
 * Tests the actual database functionality
 */

import { MongoClient } from 'mongodb';
import { createIdFromTimeStamp } from '../src/server/utils.js';

const MONGODB_URL = "mongodb://localhost:27017/turingMachineTest";
const TEST_DATABASE = 'turingMachineTest';
const TEST_COLLECTION = 'saves';

describe('Database Integration Tests', () => {
  let db;
  let client;

  beforeAll(async () => {
    try {
      client = new MongoClient(MONGODB_URL);
      await client.connect();
      db = client.db(TEST_DATABASE);
    } catch (error) {
      console.warn('MongoDB not available for integration tests:', error.message);
      console.warn('Run "npm run db:start" to start MongoDB for testing');
      throw new Error('MongoDB required for integration tests');
    }
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  beforeEach(async () => {
    // Clear test collection before each test
    if (db) {
      await db.collection(TEST_COLLECTION).deleteMany({});
    }
  });

  describe('ID Generation', () => {
    test('createIdFromTimeStamp generates unique IDs', () => {
      const id1 = createIdFromTimeStamp();
      const id2 = createIdFromTimeStamp();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    test('generated IDs are URL-safe', () => {
      const id = createIdFromTimeStamp();
      
      // Should only contain base62 characters
      expect(id).toMatch(/^[a-zA-Z0-9]+$/);
      expect(id).not.toContain('/');
      expect(id).not.toContain('?');
      expect(id).not.toContain('#');
    });
  });

  describe('Database Operations', () => {
    test('can save and retrieve machine state', async () => {
      const testState = {
        machine: {
          currentState: "q0",
          states: ["q0", "q1"],
          alphabet: ["0", "1", "_"],
          rules: [{
            id: "rule1",
            from: "q0",
            read: "0",
            to: "q1",
            write: "1",
            direction: "R"
          }]
        },
        tape: {
          content: "0110",
          headPosition: 0
        }
      };

      const id = createIdFromTimeStamp();
      
      // Save state
      await db.collection(TEST_COLLECTION).insertOne({
        id: id,
        state: testState,
        createdAt: new Date()
      });

      // Retrieve state
      const result = await db.collection(TEST_COLLECTION).findOne({ id: id });
      
      expect(result).toBeDefined();
      expect(result.id).toBe(id);
      expect(result.state).toEqual(testState);
      expect(result.createdAt).toBeDefined();
    });

    test('returns null for non-existent state', async () => {
      const result = await db.collection(TEST_COLLECTION).findOne({ 
        id: "nonexistent123" 
      });
      
      expect(result).toBeNull();
    });

    test('can save multiple different states', async () => {
      const states = [
        {
          id: createIdFromTimeStamp(),
          state: { machine: { currentState: "q0" }, tape: { content: "abc" } }
        },
        {
          id: createIdFromTimeStamp(),
          state: { machine: { currentState: "q1" }, tape: { content: "def" } }
        }
      ];

      // Save multiple states
      await db.collection(TEST_COLLECTION).insertMany(states);

      // Verify both can be retrieved
      for (const stateDoc of states) {
        const result = await db.collection(TEST_COLLECTION).findOne({ 
          id: stateDoc.id 
        });
        expect(result).toBeDefined();
        expect(result.state).toEqual(stateDoc.state);
      }
    });

    test('handles large machine states', async () => {
      // Create a large state with many rules
      const largeState = {
        machine: {
          currentState: "q0",
          states: Array.from({ length: 100 }, (_, i) => `q${i}`),
          alphabet: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_"],
          rules: Array.from({ length: 500 }, (_, i) => ({
            id: `rule${i}`,
            from: `q${i % 100}`,
            read: `${i % 10}`,
            to: `q${(i + 1) % 100}`,
            write: `${(i + 1) % 10}`,
            direction: i % 2 === 0 ? "R" : "L"
          }))
        },
        tape: {
          content: "0".repeat(1000),
          headPosition: 500
        }
      };

      const id = createIdFromTimeStamp();
      
      // Save large state
      await db.collection(TEST_COLLECTION).insertOne({
        id: id,
        state: largeState
      });

      // Retrieve and verify
      const result = await db.collection(TEST_COLLECTION).findOne({ id: id });
      
      expect(result).toBeDefined();
      expect(result.state.machine.rules).toHaveLength(500);
      expect(result.state.tape.content).toHaveLength(1000);
    });
  });

  describe('Database Indexes', () => {
    test('id field has unique index', async () => {
      const id = createIdFromTimeStamp();
      const testState = { machine: {}, tape: {} };

      // Insert first document
      await db.collection(TEST_COLLECTION).insertOne({
        id: id,
        state: testState
      });

      // Attempt to insert duplicate should fail
      await expect(
        db.collection(TEST_COLLECTION).insertOne({
          id: id, // Same ID
          state: testState
        })
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('handles invalid document insertion gracefully', async () => {
      // Try to insert invalid data
      await expect(
        db.collection(TEST_COLLECTION).insertOne({
          // Missing required fields
          invalidField: "test"
        })
      ).rejects.toThrow();
    });
  });
});