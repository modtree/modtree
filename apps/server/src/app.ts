import cors from 'cors'
import express, { Request, Response, Express } from 'express'
import { createExpressMiddleware as createMid } from '@trpc/server/adapters/express'
import { appRouter } from './trpc'
import { createOpenApiExpressMiddleware } from 'trpc-openapi'

const corsOpts = {
  origin: [
    'http://localhost:3000',
    'https://modtree-dev.vercel.app',
    'https://modtree.vercel.app',
  ],
}

/**
 * @returns {Express} an express app
 */
export function getApp(): Express {
  /**
   * create express app
   */
  const app = express()
  app.use(cors(corsOpts))
  app.use(express.json())
  /** for tRPC typesafe API calls */
  app.use('/trpc', createMid({ router: appRouter }))
  /** for OpenAPI support */
  app.use('/api', createOpenApiExpressMiddleware({ router: appRouter }))
  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}
