import * as bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { db } from '../config'
import { Routes } from './routes'

const corsOpts: CorsOptions = {
  // origin: ['https://modtree.vercel.app', 'http://localhost:3000', '127.0.0.1'],
  origin: '*',
}

db.initialize()
  .then(async () => {
    // create express app
    const app = express()
    app.use(cors(corsOpts))
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach((route) => {
      app[route.method](
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
    app.listen(process.env.PORT || 8080)
  })
  .catch((error) => console.log(error))
