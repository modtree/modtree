import {
  OpenAPIGenerator,
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import * as yaml from 'yaml'
import * as fs from 'fs'

/**
 * SETUP
 */
extendZodWithOpenApi(z)
const registry = new OpenAPIRegistry()

/**
 * BASICS
 */
const UUID = '7e2e6a37-7924-4b86-a763-098894213b2f'

const id = z.string().openapi({
  example: UUID,
})

const userId = registry.registerParameter(
  'userId',
  z.string().openapi({
    param: {
      name: 'userId',
      in: 'path',
    },
    example: UUID,
  })
)
const degreeId = registry.registerParameter(
  'degreeId',
  z.string().openapi({
    param: {
      name: 'degreeId',
      in: 'path',
    },
    example: UUID,
  })
)
const graphId = registry.registerParameter(
  'graphId',
  z.string().openapi({
    param: {
      name: 'graphId',
      in: 'path',
    },
    example: UUID,
  })
)

/**
 * SCHEMAS
 */

const UserSchema = registry.register(
  'User',
  z.object({
    id,
    facebookId: z.string(),
    googleId: z.string(),
    githubId: z.string(),
    displayName: z.string(),
    username: z.string(),
    email: z.string().email(),
    matriculationYear: z.number(),
    graduationYear: z.number(),
    graduationSemester: z.number(),
    modulesDone: z.array(id),
    modulesDoing: z.array(id),
    savedDegrees: z.array(id),
    savedGraphs: z.array(id),
    mainDegree: id,
    mainGraph: id,
  })
)

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

  fs.writeFileSync(`${__dirname}/../public/openapi-docs.yml`, fileContent, {
    encoding: 'utf-8',
  })
}

writeDocumentation()
