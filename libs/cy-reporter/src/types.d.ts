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

interface RunnerConstants {
  readonly EVENT_RUN_BEGIN: 'start'
  readonly EVENT_RUN_END: 'end'
  readonly EVENT_TEST_FAIL: 'fail'
  readonly EVENT_TEST_PASS: 'pass'
}

interface Suite {
  file?: string | undefined
  title: string
}

interface Stats {
  suites: number
  tests: number
  passes: number
  pending: number
  failures: number
  start?: Date | undefined
  end?: Date | undefined
  duration?: number | undefined
}

interface Runnable {
  title: string
  body: string
  async: boolean
  sync: boolean
  timedOut: boolean
  pending: boolean
  duration?: number | undefined
  parent?: Suite | undefined
  state?: 'failed' | 'passed' | 'pending' | undefined
  timer?: any
  allowUncaught?: boolean | undefined
  file?: string | undefined
  skip(): never
  isFailed(): boolean
  isPassed(): boolean
  fullTitle(): string
  titlePath(): string[]
  globals(globals: ReadonlyArray<string>): void
}

interface Test extends Runnable {
  type: 'test'
  speed?: 'slow' | 'medium' | 'fast' | undefined // added by reporters
  err?: Error | undefined // added by reporters
  clone(): Test
}

export class Runner {
  static readonly constants: RunnerConstants
  stats: Stats
  suite: Suite
  constructor()
  once(event: 'start', listener: () => void): this
  once(event: 'end', listener: () => void): this
  on(event: 'pass', listener: (test: Test) => void): this
  on(event: 'fail', listener: (test: Test, err: any) => void): this
}
