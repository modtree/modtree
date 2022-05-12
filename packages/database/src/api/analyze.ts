import { log } from '../cli'
import { inspect } from 'util'
import { AppDataSource } from '../data-source'

type Options = {
  display?: 'none' | 'verbose' | 'normal'
}

const printKeys = (response: any) => {
  // check for null response
  if (response === undefined || response === null) {
    return
  }
  // prints the keys returned
  const keys = Object.keys(response)
  if (keys.length > 0) {
    console.log('keys:', Array.from(keys))
  } else {
    console.log('(no keys returned)')
  }
}

const printData = (response: any, options?: Options) => {
  // if options specify none, return
  if (options?.display === 'none') {
    return
  }
  // check for null response
  if (response === undefined || response === null) {
    log.blue('response is undefined')
    return
  }
  // prints the entire thing returned
  if (options?.display === 'verbose') {
    log.blue(inspect(response))
    return
  }
  log.blue(response)
}

const printResponse = (response: any, options: Options) => {
  console.log('─────── Response ────────')
  printKeys(response)
  printData(response, options)
  console.log('─────────────────────────')
}

export const analyze = async (
  callback: () => Promise<any>,
  options?: Options
) => {
  const none = options?.display === 'none'
  const response = await callback()
  if (none) {
    return
  }
  printResponse(response, options)
  // close database if still open
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
  }
  return response
}
