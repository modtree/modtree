import type { StrRec } from './types'

function copyStrRec(rec: StrRec): StrRec {
  return Object.entries(rec).reduce((a, [k, v]) => ({ ...a, [k]: v }), {})
}

export function getAliases(tests: StrRec, aliasPreset: StrRec): StrRec {
  const result = copyStrRec(aliasPreset)
  const testNames = Object.keys(tests)
  const presetTargets = Object.values(aliasPreset)
  /**
   * auto-create aliases for repo:*
   */
  testNames.forEach((name) => {
    // if pre-set aliases already targets something, skip it
    if (presetTargets.includes(name)) return
    // do a regex match for repo:
    const re = name.match(/^repo:(.*)$/)
    if (re) result[re[1]] = name
  })
  return result
}
