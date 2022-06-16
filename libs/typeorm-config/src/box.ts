import boxen from 'boxen'

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

export const box = {
  red: boxColorLog('red'),
  green: boxColorLog('green'),
  yellow: boxColorLog('yellow'),
  blue: boxColorLog('blue'),
  magenta: boxColorLog('magenta'),
  cyan: boxColorLog('cyan'),
  gray: boxColorLog('gray'),
}
