import update from 'react-addons-update'

function buildUpdateObject (paths, value) {
  const obj = {}
  const fn = () => value
  const last = paths.length - 1

  paths.reduce((acc, key, index) =>
    acc[key] = (index === last) ? {$apply: fn} : {}
  , obj)

  return obj
}

export function createRootSwapFn (initial, source) {
  let current = initial

  return (paths, value) => {
    if (paths.length === 0) {
      current = value
    } else {
      current = update(current, buildUpdateObject(paths, value))
    }

    source.next(current)
  }
}
