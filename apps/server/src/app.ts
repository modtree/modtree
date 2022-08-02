import cors from 'cors'
import express, { Request, Response, Express } from 'express'
import { createExpressMiddleware as createMid } from '@trpc/server/adapters/express'
import { appRouter } from './trpc'
import { createOpenApiExpressMiddleware } from '@modtree/trpc-openapi'
import { generateDocs, generateRoutes } from './docs'

const corsOpts = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://modtree-docs.vercel.app',
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

  /** write OpenAPI docs only if ENV is set to rebuild */
  const rebuild = process.env.REBUILD_OPENAPI_DOCS === 'rebuild'
  if (rebuild) {
    generateDocs(appRouter)
  }
  /** generate OpenAPI routes **/
  generateRoutes(appRouter)

  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}
