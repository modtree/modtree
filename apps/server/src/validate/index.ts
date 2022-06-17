import { Request, Response } from 'express'
import { CustomValidator, Location, validationResult } from 'express-validator'

/**
 * meant to be used as a one-liner at the top of each controller method
 * ```
 * if (!validate(req, res)) return
 * ```
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {boolean}
 */
export function validate(req: Request, res: Response): boolean {
  const errors = validationResult(req)
  const ok = errors.isEmpty()
  if (!ok) res.status(400).json({ errors: errors.array() })
  return ok
}

/**
 * checks that request location (body/param/query/headers/cookie)
 * contains keys that are from the supplied array.
 *
 * intended as a safety check to ensure no other malicious keys are
 * requested to the server
 *
 * @param {string[]} arr array of accepted keys
 * @returns {CustomValidator}
 */
export function hasOnly(arr: string[]): CustomValidator {
  return (_, props) => {
    if (
      !Object.keys(props.req[props.location]).every((key) => arr.includes(key))
    ) {
      throw new Error(
        `The only ${location} attributes allowed are: ${arr.join(', ')}.`
      )
    }
  }
}

/**
 * checks that request location (body/param/query/headers/cookie)
 * contains at least one of these keys
 *
 * intended as a base requirement for the request to be legit.
 *
 * @param {string[]} arr array of required keys
 * @returns {CustomValidator}
 */
export function hasOneOf(arr: string[]): CustomValidator {
  return (_, props) => {
    if (arr.every((key) => props.req[props.location][key] === undefined)) {
      throw new Error(`Please specify at least of one of: ${arr.join(', ')}.`)
    }
  }
}
