import cors from 'cors'
import express, { Request, Response, Express, NextFunction } from 'express'
import { corsOpts } from './cors'
import { Api } from '@modtree/repos'
import { routes } from './routes'
import { validate } from './validate'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './trpc'

/**
 * register trpc
 */
const createContext = (_ctx: trpcExpress.CreateExpressContextOptions) => {
  // const k = Object.keys
  // console.log('context:', k(ctx))
  return {}
}

/**
 * **********************************************
 * requires database connection to be initialized
 * **********************************************
 *
 * @param {Api} api (use this for depedency injection in testing)
 * @returns {Express} an express app
 */
export function getApp(api: Api): Express {
  /**
   * create express app
   */
  const app = express()
  app.use(cors(corsOpts))
  app.use(express.json())
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )
  /**
   * register express routes from defined application routes
   */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  routes.forEach((route) => {
    app[route.method](
      route.route,
      ...route.validators,
      (req: Request, res: Response, next: NextFunction) => {
        if (!validate(req, res)) return
        const result = route.fn(api)(req, res, next)
        if (result instanceof Promise) {
          result
            .then((result) =>
              result !== null && result !== undefined
                ? res.json(result)
                : undefined
            )
            .catch((error) => {
              res.status(500).json({ error })
            })
        } else if (result !== null && result !== undefined) {
          res.json(result)
        }
      }
    )
  })
  return app
}
