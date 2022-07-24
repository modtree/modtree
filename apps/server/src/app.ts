import cors from 'cors'
import express, { Request, Response, Express } from 'express'
import { appRouter } from './trpc'
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi'
import * as yaml from 'yaml'
import * as fs from 'fs'

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
  app.use('/', createOpenApiExpressMiddleware({ router: appRouter }))
  /**
   * run auto generate
   */
  trpcDocumentation()
  /** register root route */
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('modtree server is running')
  })
  return app
}

function trpcDocumentation() {
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'modtree API',
    version: '1.0.0',
    baseUrl: 'http://localhost:8080',
  })

  // YAML equivalent
  const fileContent = yaml.stringify(openApiDocument)

  const location = `${__dirname}/../../../apps/docs/public/openapi-docs.yml`

  fs.writeFileSync(location, fileContent, {
    encoding: 'utf-8',
  })

  console.debug(`Written OpenAPI docs to ${location}.`)
}
