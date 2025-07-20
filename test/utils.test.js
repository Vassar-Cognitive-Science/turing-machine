/**
 * Unit tests for server utilities
 * These tests don't require a database connection
 */

import { createIdFromTimeStamp } from '../src/server/utils.js';

describe('Server Utils', () => {
  describe('createIdFromTimeStamp', () => {
    test('generates a valid ID', () => {
      const id = createIdFromTimeStamp();
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    test('generates unique IDs on repeated calls', () => {
      const ids = new Set();
      
      // Generate multiple IDs
      for (let i = 0; i < 100; i++) {
        const id = createIdFromTimeStamp();
        expect(ids.has(id)).toBe(false); // Should be unique
        ids.add(id);
      }
      
      expect(ids.size).toBe(100);
    });

    test('generates URL-safe characters only', () => {
      const id = createIdFromTimeStamp();
      
      // Should only contain alphanumeric characters (base62)
      expect(id).toMatch(/^[a-zA-Z0-9]+$/);
      
      // Should not contain URL-unsafe characters
      expect(id).not.toContain('/');
      expect(id).not.toContain('?');
      expect(id).not.toContain('#');
      expect(id).not.toContain('&');
      expect(id).not.toContain('=');
      expect(id).not.toContain(' ');
    });

    test('generates IDs with reasonable length', () => {
      const id = createIdFromTimeStamp();
      
      // Should be long enough to avoid collisions but not too long for URLs
      expect(id.length).toBeGreaterThan(5);
      expect(id.length).toBeLessThan(50);
    });

    test('generates different IDs when called in succession', async () => {
      const id1 = createIdFromTimeStamp();
      
      // Wait a tiny bit to ensure timestamp difference
      await testUtils.wait(1);
      
      const id2 = createIdFromTimeStamp();
      
      expect(id1).not.toBe(id2);
    });
  });
});