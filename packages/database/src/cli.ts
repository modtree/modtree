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

const boxenConfig = (color: Color) => ({
  borderColor: color,
  padding: {
    right: 1,
    left: 1,
    top: 0,
    bottom: 0,
  },
})

const colorLog = (color: Color) => {
  /**
   * sends all arguments to chalk[color]
   * @param {any[]} ...args
   */
  function helper(...args: any[]) {
    console.log(chalk[color](...args))
  }
  return helper
}

const boxColorLog = (color: Color) => {
  /**
   * sends string to boxen
   * @param {string} text
   */
  function helper(text: string) {
    console.log(boxen(text, boxenConfig(color)))
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
