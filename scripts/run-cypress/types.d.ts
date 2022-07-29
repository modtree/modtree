import type { Runner } from 'mocha'

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
  data: {
    stats: Runner['stats']
    file?: string
  }
}
