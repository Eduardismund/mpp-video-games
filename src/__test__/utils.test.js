import {describe, it, expect} from 'vitest'
import {computePercentile} from "../utils.js";

describe('computePercentile', () => {
  it("should return the correct percentile value for sorted array", () => {
    const arr = [10, 20, 30, 40, 50];
    expect(computePercentile(arr, 0)).toBe(10);   // 0th percentile (min)
    expect(computePercentile(arr, 100)).toBe(50); // 100th percentile (max)
    expect(computePercentile(arr, 50)).toBe(30);  // Median
  });

  it("should interpolate correctly between values", () => {
    const arr = [10, 20, 30, 40, 50];
    expect(computePercentile(arr, 25)).toBe(20)
    expect(computePercentile(arr, 75)).toBe(40)
  });

  it("should handle a single-element array", () => {
    expect(computePercentile([42], 0)).toBe(42);
    expect(computePercentile([42], 100)).toBe(42);
  });

  it("should handle two-element arrays correctly", () => {
    expect(computePercentile([10, 20], 50)).toBe(15); // Interpolates correctly
  });

  it("should throw an error for out-of-range percentiles", () => {
    const arr = [10, 20, 30];
    expect(() => computePercentile(arr, -5)).toThrow("Percentile must be between 0 and 100.");
    expect(() => computePercentile(arr, 105)).toThrow("Percentile must be between 0 and 100.");
  });
})
