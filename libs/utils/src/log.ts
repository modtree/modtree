import chalk from 'chalk'

type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'

/* eslint-disable @typescript-eslint/no-explicit-any */
type TextPrinter = (...e: any[]) => void

/**
 * prints colored text
 *
 * @param {Color} color
 * @returns {TextPrinter}
 */
function colorLog(color: Color): TextPrinter {
  /**
   * sends all arguments to chalk[color]
   *
   * @param {...any[]} args
   */
  function helper(...args: any[]) {
    console.debug(chalk[color](...args))
  }
  return helper
}

export const log = {
  red: colorLog('red'),
  green: colorLog('green'),
  yellow: colorLog('yellow'),
  blue: colorLog('blue'),
  magenta: colorLog('magenta'),
  cyan: colorLog('cyan'),
  gray: colorLog('gray'),
  warn: colorLog('yellow'),
}
