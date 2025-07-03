import { sum } from './sum.helper';

describe('sum.helper.ts', () => {
  test('should sum two numbers', () => {
    // Arrange
    const num1 = 5;
    const num2 = 10;

    // Act
    const result = sum(num1, num2);

    // Assert
    expect(result).toBe(num1 + num2);
  });
});
