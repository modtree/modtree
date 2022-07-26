import { generateOpenApiDocument } from 'trpc-openapi'
import * as yaml from 'yaml'
import * as fs from 'fs'
import { AppRouter } from './trpc'

export function trpcDocumentation(appRouter: AppRouter) {
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'modtree API',
    version: '1.0.0',
    baseUrl: 'http://localhost:8080/api',
  })

  // YAML equivalent
  const fileContent = yaml.stringify(openApiDocument)

  const location = `${__dirname}/../../../apps/docs/public/openapi-docs.yml`

  fs.writeFileSync(location, fileContent, {
    encoding: 'utf-8',
  })

  console.debug(`Written OpenAPI docs to ${location}.`)
}
