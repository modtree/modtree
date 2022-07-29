import { generateOpenApiDocument } from '@modtree/trpc-openapi'
import * as yaml from 'yaml'
import * as fs from 'fs'
import { AppRouter } from './trpc'

export function generateDocs(appRouter: AppRouter) {
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'modtree API',
    version: '1.0.0',
    baseUrl: process.env.SWAGGER_PUBLIC_BACKEND || 'http://localhost:8080/api',
  })

  // YAML equivalent
  const fileContent = yaml.stringify(openApiDocument)

  const location = `${__dirname}/../../../apps/docs/public/openapi-docs.yml`

  fs.writeFileSync(location, fileContent, {
    encoding: 'utf-8',
  })

  console.debug(`Written OpenAPI docs to ${location}.`)
}
