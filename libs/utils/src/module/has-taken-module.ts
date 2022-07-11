/**
 * Returns true if the moduleCode belongs to a module that is in
 * modulesDone or modulesDoing.
 *
 * @param {string[]} modulesDone
 * @param {string[]} modulesDoing
 * @param {string} moduleCode
 * @returns {boolean}
 */
export function hasTakenModule(
  modulesDone: string[],
  modulesDoing: string[],
  moduleCode: string
): boolean {
  return modulesDone.includes(moduleCode) || modulesDoing.includes(moduleCode)
}
