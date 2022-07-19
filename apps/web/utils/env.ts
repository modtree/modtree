import { green, yellow, red } from 'chalk'

/** for use when debugging */
const forceProd = false
const emitLog = true

const getIsDevEnv = () => {
  const env = process.env['NODE_ENV']
  if (env === 'production') return false // real production override
  if (forceProd) return false // forceProd override at debug-time
  // is development environment otherwise
  if (env === 'development') return true
  return true
}

/** the state used app-wide */
export const devEnv = getIsDevEnv()

type SingleLogger = (..._: any) => void
type Logger = {
  ok: SingleLogger
  warn: SingleLogger
  err: SingleLogger
}

const getDevLogger = (emit: boolean, logger: Logger): Logger =>
  Object.entries(logger).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: emit ? value : null }),
    {} as Logger
  )

const logger = {
  ok: (...args: any) => console.log(green(...args)),
  warn: (...args: any) => console.log(yellow(...args)),
  err: (...args: any) => console.log(red(...args)),
}

export const log = getDevLogger(emitLog, logger)
