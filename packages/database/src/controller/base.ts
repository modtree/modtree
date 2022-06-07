import { Request, Response } from "express"
import { validationResult } from "express-validator"

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
