import {
  extendZodWithOpenApi,
  OpenAPIGenerator,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import * as yaml from 'yaml'
import * as fs from 'fs'
import base from '../schemas/base'
import entities from '../schemas/entities'

/**
 * SETUP
 */
extendZodWithOpenApi(z)
const registry = new OpenAPIRegistry()

/**
 * Register path params
 */
const userId = registry.registerParameter('userId', base.userId)
const degreeId = registry.registerParameter('degreeId', base.degreeId)
const graphId = registry.registerParameter('graphId', base.graphId)

/**
 * Register schemas
 */
const UserSchema = registry.register('User', entities.User)

/**
 * Register routes
 */
registry.registerPath({
  method: 'get',
  path: '/user/{userId}',
  description: 'Get user data by its id',
  summary: 'Get a single user',
  request: {
    params: z.object({ userId }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: UserSchema.openapi({
        description: 'Object with user data.',
      }),
    },
  },
})

function getOpenApiDocumentation() {
  const generator = new OpenAPIGenerator(registry.definitions)

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'modtree API',
      description: 'modtree uses tRPC with zod to make our APIs typesafe.',
    },
  })
}

function writeDocumentation() {
  // OpenAPI JSON
  const docs = getOpenApiDocumentation()

  // YAML equivalent
  const fileContent = yaml.stringify(docs)

  fs.writeFileSync(`${__dirname}/openapi-docs.yml`, fileContent, {
    encoding: 'utf-8',
  })
}

writeDocumentation()
