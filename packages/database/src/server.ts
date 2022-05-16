import express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { AppDataSource } from './data-source'
import { Routes } from './routes'
import { ModuleCondensed } from './entity/ModuleCondensed'

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach((route) => {
      ;(app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
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

    // setup express app here
    // ...

    // start express server
    app.listen(3000)

    // insert new users for test
    await AppDataSource.manager.save(
      AppDataSource.manager.create(ModuleCondensed, {
        moduleCode: 'MA2001',
        moduleLevel: 2,
        title: 'Linear Algebra 1',
      })
    )

    await AppDataSource.manager.save(
      AppDataSource.manager.create(ModuleCondensed, {
        moduleCode: 'MA2002',
        moduleLevel: 2,
        title: 'Calculus 1',
      })
    )

    console.log(
      'Express server has started on port 3000. Open http://localhost:3000/users to see results'
    )
  })
  .catch((error) => console.log(error))
