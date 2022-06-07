import { dirname, basename, join } from 'path'
/**
 * parses out the numbers that represent the module level
 *
 * @param {string} moduleCode
 * @returns {number}
 */
export function getModuleLevel(moduleCode: string): number {
  return parseInt(moduleCode.replace(/\D*([0-9]*)\D*.*$/, '$1'), 10) || 0
}

/**
 * wrap a string with the NUSMods API url
 *
 * @param {string} req
 * @returns {string}
 */
export function nusmodsApi(req: string): string {
  return `https://api.nusmods.com/v2/2021-2022/${req}.json`
}

/**
 * given the full path to a file, return its parent + its own filename
 * input: /path/to/foo/bar.ts
 * output: foo/bar.ts
 *
 * @param {string} fullPath
 * @returns {string}
 */
export function oneUp(fullPath: string): string {
  const parent = basename(dirname(fullPath))
  const child = basename(fullPath)
  return join(parent, child)
}

/**
 * checks if the input is a non-empty string
 *
 * @param {string} value
 * @returns {boolean}
 */
export function nonEmptyString(value: any): boolean {
  return typeof value === 'string' && value.length > 0
}

/**
 * checks if the input is a non-empty string
 *
 * @param {string} value
 * @returns {boolean}
 */
export function validModuleCode(moduleCode: string): boolean {
  const valid = new RegExp(/^[A-Z]{2,4}[0-9]{4}[A-Z]{0,5}[0-9]{0,2}$/)
  const result = Boolean(moduleCode.match(valid))
  if (!result) throw new Error('Invalid module code')
  return result
}
