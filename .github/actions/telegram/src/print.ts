import emoji from './emoji.json'
import type { Needs } from './types'

/**
 * ignore list for job ids
 */
const ignore = ['pre_job']

const needs = (data: Needs): string => {
  const results: string[] = []
  Object.entries(data).forEach(([key, value]) => {
    if (ignore.includes(key)) return
    results.push(`${emoji[value.result]} ${key}`)
  })
  return results.join('\n')
}

export const print = {
  needs,
}
