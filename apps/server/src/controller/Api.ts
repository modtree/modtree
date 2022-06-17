import { Request, Response } from 'express'
import { flatten } from '@modtree/utils'
import { db } from '@modtree/typeorm-config'
import { Api } from '@modtree/repo-api'
import { validate } from './base'

/** Generic API controller */
export class ApiController {
  private api = new Api(db)

  /**
   * handles user login
   *
   * @param {Request} req
   * @param {Response} res
   */
  async userLogin(req: Request, res: Response) {
    if (!validate(req, res)) return
    const { authZeroId, email } = req.body
    return this.api
      .userLogin(authZeroId, email)
      .then((user) => {
        res.json(flatten.user(user))
      })
      .catch(() => {
        res.status(500)
      })
  }
}
