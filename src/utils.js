/**
 *
 * @param {number[]} arr must be sorted
 * @param {number} p
 * @returns {number}
 */
export function computePercentile(arr, p) {
  if (p < 0 || p > 100) {
    throw new Error("Percentile must be between 0 and 100.");
  }

  let index = (p / 100) * (arr.length - 1);
  let lower = Math.floor(index);
  let upper = Math.ceil(index);

  if (lower === upper) {
    return arr[lower];
  }

  return arr[lower] + (arr[upper] - arr[lower]) * (index - lower);
}
