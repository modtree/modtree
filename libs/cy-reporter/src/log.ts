import { green, red, cyan } from 'chalk'

// set debug emit
const debugMode = false

type LogObject = Record<string, (..._: any) => void>

export const log = {
  pass: (...a: any) => console.log(green('pass', ...a)),
  fail: (...a: any) => console.log(red('fail', ...a)),
  error: (...a: any) => console.log(red(...a)),
  cyan: (...a: any) => console.log(cyan(...a)),
  green: (...a: any) => console.log(green(...a)),
  red: (...a: any) => console.log(red(...a)),
}

/**
 * only logs if debugMode is set to true
 */
const getDebugLog = (emit: boolean, log: LogObject) => {
  return Object.entries(log).reduce(
    (a, [k, l]) => ({ ...a, [k]: emit ? l : () => 0 }),
    {} as Record<string, (...a: any) => void>
  )
}

export const debugLog = getDebugLog(debugMode, log)
