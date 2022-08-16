import { generateOpenApiDocument } from '@modtree/trpc-openapi'
import * as fs from 'fs'
import { basename, dirname, join, resolve } from 'path'
import { AppRouter } from './trpc'

const rootDir = resolve(__dirname, '../../..')

/**
 * checks if file exists, then writes to it
 */
function safeWrite(file: string, contents: string) {
  if (fs.existsSync(dirname(file))) {
    fs.writeFileSync(file, contents, { encoding: 'utf-8' })
    const short = join(dirname(file), basename(file))
    console.debug(`Updated ${short}.`)
  } else {
    console.debug(`Warning: tried to write to ${file} but it does not exist.`)
  }
}

export function generateDocs(appRouter: AppRouter) {
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'modtree API',
    version: '1.0.0',
    /**
     * To reduce duplication, we only have 1 exported docs.
     * The baseUrl is updated in the docs environment.
     */
    baseUrl: 'http://localhost:8080/api',
  })

  // JSON equivalent
  const contents = JSON.stringify(openApiDocument, null, 2)
  const filepath = resolve(rootDir, 'apps/docs/public/openapi-docs.json')
  safeWrite(filepath, contents)
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

  const contents = JSON.stringify(routes, null, 2)
  const filepath = resolve(rootDir, 'apps/server/test/openapi/routes.json')

  safeWrite(filepath, contents)
}
