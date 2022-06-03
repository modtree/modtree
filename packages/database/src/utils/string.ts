import { dirname, basename, join } from 'path'
/**
 * parses out the numbers that represent the module level
 * @param {string} moduleCode
 * @return {number}
 */
export function getModuleLevel(moduleCode: string): number {
  return parseInt(moduleCode.replace(/\D*([0-9]*)\D*.*$/, '$1')) || 0
}

/**
 * wrap a string with the NUSMods API url
 * @param {string} req
 * @return {string}
 */
export function nusmodsApi(req: string): string {
  return `https://api.nusmods.com/v2/2021-2022/${req}.json`
}

/**
 * given the full path to a file, return its parent + its own filename
 * input: /path/to/foo/bar.ts
 * output: foo/bar.ts
 * @param {string} fullPath
 * @return {string}
 */
export function oneUp(fullPath: string): string {
  const parent = basename(dirname(fullPath))
  const child = basename(fullPath)
  return join(parent, child)
}
