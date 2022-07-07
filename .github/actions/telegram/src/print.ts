import emoji from './emoji.json'
import type { Needs } from './types'

const needs = (data: Needs): string => {
  const results: string[] = []

  Object.entries(data).forEach(([key, value]) => {
    const e = emoji[value.result]
    results.push(`${e} ${key}`)
  })
  return results.join('\n')
}

export const print = {
  needs,
}
