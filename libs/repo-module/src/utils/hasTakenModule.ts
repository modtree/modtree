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
  const modules = modulesDone.concat(modulesDoing)
  return modules.includes(moduleCode)
}
