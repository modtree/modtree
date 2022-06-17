import cors from 'cors'
import express, { NextFunction, Request, Response, Express } from 'express'
import { getRoutes } from './routes'
import { corsOpts } from './cors'

/**
 * requires database connection to be initialized
 *
 * @returns {Express} an express app
 */
export function getApp(): Express {
  // create express app
  const app = express()
  app.use(cors(corsOpts))
  app.use(express.json())
  // register express routes from defined application routes
  const routes = getRoutes()
  routes.forEach((route) => {
    app[route.method](
      route.route,
      ...route.validators,
      (req: Request, res: Response, next: NextFunction) => {
        const result = new route.controller()[route.action](req, res, next)
        if (result instanceof Promise) {
          result.then((result) =>
            result !== null && result !== undefined
              ? res.send(result)
              : undefined
          )
        } else if (result !== null && result !== undefined) {
          res.json(result)
        }
      }
    )
  })
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}
