import type { ArrRec, StrRec } from './types'

function copyArrRec(rec: ArrRec): ArrRec {
  return Object.entries(rec).reduce((a, [k, v]) => ({ ...a, [k]: v }), {})
}

export function getAliases(tests: StrRec, aliases: ArrRec): ArrRec {
  const result = copyArrRec(aliases)
  const allSingleTargets = Object.values(aliases).reduce((acc, curr) => {
    if (curr.length === 1) acc.push(...curr)
    return acc
  }, [] as string[])
  /**
   * auto-create aliases for repo:*
   */
  Object.keys(tests).forEach((name) => {
    // if pre-set aliases already targets something, skip it
    if (allSingleTargets.includes(name)) return
    // do a regex match for repo:
    const re = name.match(/^repo:(.*)$/)
    if (re) result[re[1]] = [name]
  })
  return result
}
