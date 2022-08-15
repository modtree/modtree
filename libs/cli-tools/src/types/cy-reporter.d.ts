import type { Runner } from './mocha-patch'

export type Run = {
  timestamp: number
  pass: boolean
  gitHash: string
}

export type TestData = {
  file: string
  runs: Run[]
}

export type Packet = {
  action: 'start' | 'end'
  data: { stats: Runner['stats']; file?: string }
}
