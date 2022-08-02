import cors from 'cors'
import express, { Request, Response, Express } from 'express'
import { list } from './list'
import { repo } from './main'

/**
 * @returns {Express} an express app
 */
export function getApp(): Express {
  /**
   * create express app
   */
  const app = express()
  app.use(cors({ origin: '*' }))
  app.use(express.json())

  app.get('/list', (req: Request, res: Response) => {
    const files = req.query.files as string[]
    const commits = req.query.commits as string[]
    list(repo, files, commits).then((result) => {
      res.send({
        result,
      })
    })
  })

  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}
