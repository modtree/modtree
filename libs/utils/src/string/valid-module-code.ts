export const validModuleRegex = /^[A-Z]{2,4}[0-9]{4}[A-Z]{0,5}[0-9]{0,2}$/

/**
 * checks if the input is a valid module code
 *
 * @param {string} moduleCode
 * @returns {boolean}
 */
export function validModuleCode(moduleCode: string): boolean {
  return Boolean(moduleCode.match(validModuleRegex))
}
