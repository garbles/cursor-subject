const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g
const reEscapeChar = /\\(\\)?/g

// https://github.com/lodash/lodash/blob/4.3.0/lodash.js#L5316
function stringToPath (str) {
  const result = []

  str.replace(rePropName, function replaceChars (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, `$1`) : (number || match))
  })

  return result
}

function isString (obj) {
  return !!obj && typeof obj === `string`
}

export function toArray (paths) {
  if (Array.isArray(paths)) {
    return paths
  }

  if (isString(paths)) {
    return stringToPath(paths)
  }

  return []
}
