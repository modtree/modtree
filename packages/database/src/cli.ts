const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[37m',
}

const clog = (color: string) => (text: string) => {
  console.log(`${color}${text}${colors.reset} `)
}

const fnmaeLog = (text: string) => {
  console.log(
    `${colors.gray}[ ${colors.green}${text}${colors.gray} ]${colors.reset}`
  )
}

export const log = {
  red: clog(colors.red),
  green: clog(colors.green),
  yellow: clog(colors.yellow),
  blue: clog(colors.blue),
  magenta: clog(colors.magenta),
  cyan: clog(colors.cyan),
  gray: clog(colors.gray),
  fname: fnmaeLog,
}
