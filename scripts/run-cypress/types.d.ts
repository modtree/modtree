export type Run = {
  timestamp: number
  pass: boolean
  gitHash: string
}

export type TestData = {
  file: string
  runs: Run[]
}
