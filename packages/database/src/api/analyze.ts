import { log } from '../cli'
import { inspect } from 'util'

type Options = {
  full?: boolean
}

const printResponse = (response: any, options: Options) => {
  // check for null response
  if (response === undefined || response === null) {
    log.blue('response is undefined')
    return
  }
  // prints the keys returned
  const keys = Object.keys(response)
  if (keys.length > 0) {
    console.log('keys:', Array.from(keys))
  } else {
    console.log('(no keys returned)')
  }
  // prints the entire thing returned
  if (options?.full === true) {
    log.blue(inspect(response))
    return
  }
  log.blue(response)
}

export const analyze = async (callback: () => Promise<any>, options?: Options) => {
  const response = await callback()
  console.log('─────── Response ────────')
  printResponse(response, options)
  console.log('─────────────────────────')
}
