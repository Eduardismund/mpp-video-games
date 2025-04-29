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

/**
 * @template T
 * @param {{[key:string]: any}} source
 * @param {{[key:string]: ('string'|'boolean'|'number')}} propDefs
 * @return {T}
 */
export function extractProperties(source, propDefs) {
  return Object.assign({}, ...
    Object.keys(source).map(key => {
      if (propDefs[key] === 'string') {
        return {[key]: `${source[key]}`}
      }
      if (propDefs[key] === 'boolean') {
        return {[key]: `${source[key]}`.toLowerCase() === 'true'}
      }
      if (propDefs[key] === 'number') {
        return {[key]: Number(source[key])}
      }
    }).filter(elem => !!elem))
}

/**
 *
 * @param {Record<string, string|boolean|number>} source
 * @param {Record<string,  'string' | 'number' | 'boolean'>} propDefs
 * @return {Record<string, string | readonly string[]>}
 */
export function convertPropertiesToString(source, propDefs) {
  const propsArr = Object.keys(source).map(key => {
    if (!propDefs[key]) {
      return undefined
    }
    return {[key]: `${source[key]}`}

  }).filter(elem => !!elem)
  return Object.assign({}, ...propsArr)

}
