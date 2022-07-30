import { green, red, cyan, bgGreen, bgRed, bgWhite, gray } from 'chalk'

// set debug emit
const debugMode = false

type LogObject = Record<string, (..._: any) => void>

export const log = {
  pass: (...a: any) => console.log(bgGreen.black(' PASS '), ...a),
  fail: (...a: any) => console.log(bgRed.black(' FAIL '), ...a),
  error: (...a: any) => console.log(red(...a)),
  cyan: (...a: any) => console.log(cyan(...a)),
  start: (...a: any) => console.log(bgWhite.black(' start '), ...a),
  end: (...a: any) => console.log(gray('end:', ...a)),
  green: (...a: any) => console.log(green(...a)),
  red: (...a: any) => console.log(red(...a)),
  gray: (...a: any) => console.log(gray(...a)),
  normal: (...a: any) => console.log(...a),
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
