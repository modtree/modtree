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
    // read request
    const files = req.query.files as string[]
    const commits = req.query.commits as string[]
    // ORM call
    list(repo, files || [], commits || []).then((r) => res.send(r))
  })

  app.post('/create', (req: Request, res: Response) => {
    // read request
    const file = req.body.file as string
    const timestamp = req.body.timestamp as number
    const gitHash = req.body.gitHash as string
    const pass = req.body.pass === true
    if (!file || !timestamp || !gitHash) {
      res.status(400)
      return
    }
    // ORM call
    repo
      .save(repo.create({ file, timestamp, gitHash, pass }))
      .then((r) => res.send(r))
  })

  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('cy-reporter server is running')
  })
  return app
}
