/**
 * copies props from source entity to the target entity
 * @param {T} source
 * @param {T} target
 */
export function copy<T>(source: T, target: T) {
  Object.keys(source).forEach((key) => {
    target[key] = source[key]
  })
}
