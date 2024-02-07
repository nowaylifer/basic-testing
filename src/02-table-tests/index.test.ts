import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 4, b: 2, action: 'invalid', expected: null },
  { a: '4', b: 2, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('$a $action $b', ({ a, b, action, expected }) => {
    const result = simpleCalculator({ a, b, action });

    if (expected === null) {
      expect(result).toBeNull();
    } else {
      expect(result).toBe(expected);
    }
  });
});
