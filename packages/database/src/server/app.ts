import * as bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { Routes } from './routes'

const corsOpts: CorsOptions = {
  origin: ['https://modtree.vercel.app', 'http://localhost:3000'],
}

// create express app
const app = express()
app.use(cors(corsOpts))
app.use(bodyParser.json())
// register express routes from defined application routes
Routes.forEach((route) => {
  app[route.method](
    route.route,
    (req: Request, res: Response, next: NextFunction) => {
      const result = new route.controller()[route.action](req, res, next)
      if (result instanceof Promise) {
        result.then((result) =>
          result !== null && result !== undefined ? res.send(result) : undefined
        )
      } else if (result !== null && result !== undefined) {
        res.json(result)
      }
    }
  )
})

export default app
