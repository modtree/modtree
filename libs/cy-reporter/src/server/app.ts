import cors from 'cors'
import express, { Request, Response, Express } from 'express'

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
    res.send({
      'received params': req.query,
    })
  })

  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}
