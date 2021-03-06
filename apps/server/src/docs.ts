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

export function generateRoutes(appRouter: AppRouter) {
  function parseRoute(route: any) {
    const openapi = route.meta.openapi
    return {
      method: openapi?.method,
      path: openapi?.path,
    }
  }
  // get routes
  const queries = Object.values(appRouter._def.queries).map(parseRoute)
  const mutations = Object.values(appRouter._def.mutations).map(parseRoute)
  const routes = [...queries, ...mutations]

  const fileContent = JSON.stringify(routes, null, 2)
  const location = `${__dirname}/../../../references/routes.json`

  fs.writeFileSync(location, fileContent, {
    encoding: 'utf-8',
  })
  console.debug('Updated references/routes.json.')
}
