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

  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}
