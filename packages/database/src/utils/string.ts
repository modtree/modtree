/**
 * parses out the numbers that represent the module level
 * @param {string} moduleCode
 * @return {number}
 */
export function getModuleLevel(moduleCode: string): number {
  if (moduleCode === undefined) {
    return 0
  }
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
