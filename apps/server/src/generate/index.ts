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
 * With OpenAPI
 */
const schema = {
  User: UserSchema.openapi({ description: 'Flattened user object.' }),
}

/**
 * Register routes
 */
registry.registerPath({
  tags: ['User'],
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
      schema: schema.User,
    },
  },
})
registry.registerPath({
  tags: ['User'],
  method: 'post',
  path: '/user',
  description: 'Creates a user after social authentication',
  summary: 'Create a user',
  request: {
    params: z.object({
      email: z.string().email(),
      provider: z.string().optional(),
      providerId: z.string().optional(),
    }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: schema.User,
    },
  },
})

export function writeDocumentation() {
  const generator = new OpenAPIGenerator(registry.definitions)

  // OpenAPI JSON
  const docs = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'modtree API',
      description: 'modtree uses tRPC with zod to make our APIs typesafe.',
    },
    tags: [{ name: 'User' }],
  })

  // YAML equivalent
  const fileContent = yaml.stringify(docs)

  const location = `${__dirname}/../../../apps/docs/public/openapi-docs.yml`

  fs.writeFileSync(location, fileContent, {
    encoding: 'utf-8',
  })

  console.debug(`Written OpenAPI docs to ${location}.`)
}
