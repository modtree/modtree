import express, { Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import { AppDataSource } from './data-source'
import { Routes } from './routes'
import cors, { CorsOptions } from 'cors'

const corsOpts: CorsOptions = {
  origin: 'http://localhost:3000',
}

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express()
    app.use(cors(corsOpts))
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach((route) => {
      ;(app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: NextFunction) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          )
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
    app.listen(8080)
  })
  .catch((error) => console.log(error))
