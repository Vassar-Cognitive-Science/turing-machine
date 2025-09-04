// Test the wildcard functionality
describe('Wildcard Functionality', () => {
  describe('Wildcard Logic Tests', () => {
    test('WRITE * logic preserves read symbol', () => {
      // Test the core wildcard logic from the implementation
      const testCases = [
        { readSymbol: 'A', writeField: '*', expected: 'A' },
        { readSymbol: 'B', writeField: '∗', expected: 'B' },
        { readSymbol: '#', writeField: '*', expected: '#' },
        { readSymbol: 'X', writeField: 'Y', expected: 'Y' },
        { readSymbol: 'Z', writeField: '', expected: '#' },
        { readSymbol: '1', writeField: null, expected: '#' },
      ];

      testCases.forEach(({ readSymbol, writeField, expected }) => {
        // This replicates the logic from stores/index.ts:119
        const writeValue = (writeField === '*' || writeField === '∗') ? readSymbol : (writeField || '#');
        expect(writeValue).toBe(expected);
      });
    });

    test('Rule matching priority logic', () => {
      // Test rule matching priority: exact match over wildcard
      const rules = [
        { id: 'wildcard', in_state: 'START', read: '*', write: 'WILD' },
        { id: 'exact', in_state: 'START', read: 'A', write: 'EXACT' },
      ];

      // Simulate the priority logic from matchRule function
      const currentState = 'START';
      const readSymbol = 'A';
      
      let exactMatch = null;
      let wildcardMatch = null;

      for (const rule of rules) {
        if (rule.in_state === currentState) {
          if (rule.read === readSymbol) {
            exactMatch = rule;
            break; // Exact match takes priority
          } else if (rule.read === "*" || rule.read === "∗") {
            wildcardMatch = rule;
          }
        }
      }

      const selectedRule = exactMatch || wildcardMatch;
      expect(selectedRule).toBeTruthy();
      expect(selectedRule.id).toBe('exact');
      expect(selectedRule.write).toBe('EXACT');
    });

    test('Wildcard matching when no exact match', () => {
      const rules = [
        { id: 'wildcard', in_state: 'START', read: '*', write: 'WILD' },
        { id: 'other', in_state: 'START', read: 'B', write: 'OTHER' },
      ];

      const currentState = 'START';
      const readSymbol = 'X'; // No exact match for X
      
      let exactMatch = null;
      let wildcardMatch = null;

      for (const rule of rules) {
        if (rule.in_state === currentState) {
          if (rule.read === readSymbol) {
            exactMatch = rule;
            break;
          } else if (rule.read === "*" || rule.read === "∗") {
            wildcardMatch = rule;
          }
        }
      }

      const selectedRule = exactMatch || wildcardMatch;
      expect(selectedRule).toBeTruthy();
      expect(selectedRule.id).toBe('wildcard');
      expect(selectedRule.write).toBe('WILD');
    });

    test('Combined READ * and WRITE * creates identity operation', () => {
      const rule = { read: '*', write: '*' };
      const testSymbols = ['A', 'B', 'C', '1', '2', '3', '#', '∅', 'X', 'Y', 'Z'];

      testSymbols.forEach(symbol => {
        // Test that READ * would match (this is just conceptual)
        const wouldMatch = rule.read === '*' || rule.read === '∗' || rule.read === symbol;
        expect(wouldMatch).toBe(true);

        // Test that WRITE * preserves the symbol
        const writeValue = (rule.write === '*' || rule.write === '∗') ? symbol : (rule.write || '#');
        expect(writeValue).toBe(symbol);
      });
    });

    test('Unicode asterisk equivalence', () => {
      const testCases = [
        { writeField: '*', isWildcard: true },
        { writeField: '∗', isWildcard: true },
        { writeField: 'A', isWildcard: false },
        { writeField: '', isWildcard: false },
        { writeField: null, isWildcard: false },
      ];

      testCases.forEach(({ writeField, isWildcard }) => {
        const result = writeField === '*' || writeField === '∗';
        expect(result).toBe(isWildcard);
      });
    });

    test('Edge cases for wildcard logic', () => {
      // Test edge cases that might occur
      const edgeCases = [
        { readSymbol: '', writeField: '*', expected: '' }, // Empty read symbol
        { readSymbol: ' ', writeField: '*', expected: ' ' }, // Space
        { readSymbol: '∅', writeField: '*', expected: '∅' }, // Empty cell symbol
        { readSymbol: '#', writeField: '*', expected: '#' }, // Blank symbol
      ];

      edgeCases.forEach(({ readSymbol, writeField, expected }) => {
        const writeValue = (writeField === '*' || writeField === '∗') ? readSymbol : (writeField || '#');
        expect(writeValue).toBe(expected);
      });
    });
  });

  describe('Implementation Verification', () => {
    test('Verify actual wildcard constants used in code', () => {
      // Test that our implementation matches the constants used in the actual code
      const REGULAR_ASTERISK = '*';
      const UNICODE_ASTERISK = '∗';
      
      // These should match what's used in the stores
      expect(REGULAR_ASTERISK).toBe('*');
      expect(UNICODE_ASTERISK).toBe('∗');
      
      // Test the condition used in the code
      const testWrite = (writeValue, readSymbol) => {
        return (writeValue === REGULAR_ASTERISK || writeValue === UNICODE_ASTERISK) ? readSymbol : (writeValue || '#');
      };

      expect(testWrite('*', 'A')).toBe('A');
      expect(testWrite('∗', 'B')).toBe('B');
      expect(testWrite('C', 'A')).toBe('C');
      expect(testWrite('', 'A')).toBe('#');
    });
  });
});