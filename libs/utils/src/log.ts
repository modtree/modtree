import boxen from 'boxen'
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
    console.log(chalk[color](...args))
  }
  return helper
}

/**
 * prints a colored box around text
 *
 * @param {Color} color
 * @returns {TextPrinter}
 */
function boxColorLog(color: Color): TextPrinter {
  /**
   * sends string to boxen
   *
   * @param {string} text
   */
  function helper(text: string) {
    console.log(
      boxen(text, {
        borderColor: color,
        padding: {
          right: 1,
          left: 1,
          top: 0,
          bottom: 0,
        },
      })
    )
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

export const box = {
  red: boxColorLog('red'),
  green: boxColorLog('green'),
  yellow: boxColorLog('yellow'),
  blue: boxColorLog('blue'),
  magenta: boxColorLog('magenta'),
  cyan: boxColorLog('cyan'),
  gray: boxColorLog('gray'),
}

export class Console {
  static log(...args: any) {
    console.log(...args)
  }
}
