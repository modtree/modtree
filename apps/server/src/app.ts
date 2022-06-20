import cors from 'cors'
import express, { NextFunction, Request, Response, Express } from 'express'
import { getRoutes } from './routes'
import { corsOpts } from './cors'
import { Api } from '@modtree/repo-api'

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
  /**
   * register express routes from defined application routes
   */
  const routes = getRoutes()
  routes.forEach((route) => {
    app[route.method](
      route.route,
      ...route.validators,
      (req: Request, res: Response, next: NextFunction) => {
        /**
         * instantiate controller class
         */
        const controller = new route.controller(api)
        /**
         * call the method
         */
        const result = controller[route.action](req, res, next)
        /**
         * handle async/sync functions differently
         */
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
