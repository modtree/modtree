import { inspect } from 'util'
import { log } from '../cli'
import { endpoint } from '../data-source'
import { ModtreeFunction } from '../../types/modtree'
import { db } from '../config'

type Verbosity = 'none' | 'verbose' | 'normal'

/** prints analytics */
class Print {
  /**
   * prints the keys of the response
   *
   * @param {any} response
   */
  static keys(response: any) {
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

  /**
   * prints the full contents of the response
   *
   * @param {any} response
   * @param {Verbosity} verbosity
   */
  static data(response: any, verbosity: Verbosity) {
    // if verbosity is none, return immediately
    if (verbosity === 'none') {
      return
    }
    // check for null response
    if (response === undefined || response === null) {
      console.log('response is undefined')
      return
    }
    // prints the entire thing expanded
    if (verbosity === 'verbose') {
      console.log(inspect(response))
      return
    }
    // normal print
    console.log(response)
  }

  /**
   * prints the length of the response, if it's an array or a set
   *
   * @param {any} response
   */
  static size(response: any) {
    // check for null response
    if (response === undefined || response === null) {
      return
    }
    if (response instanceof Set) {
      console.log('size of Set:', response.size)
      return
    }
    if (response instanceof Array) {
      console.log('size of Array:', response.length)
    }
  }
}

/**
 * prints the return value of a function to be analyzed
 *
 * @param {any} response
 * @param {Verbosity} verbosity
 */
function printResponse(response: any, verbosity: Verbosity) {
  log.yellow('─────── BEGIN RESPONSE ───────')
  // only print data if set to verbose
  Print.data(response, verbosity)
  // always print keys
  Print.keys(response)
  Print.size(response)
  log.yellow('──────── END RESPONSE ────────')
}

/**
 * analyzes the output of an endpoint function
 *
 * @param {ModtreeFunction} callback
 * @param {Verbosity} verbosity
 */
export async function analyze<T>(
  callback: ModtreeFunction<T>,
  verbosity: Verbosity = 'normal'
) {
  const response = await endpoint(db, callback)
  if (verbosity === 'none') {
    return
  }
  printResponse(response, verbosity)
}
