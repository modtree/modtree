'use strict'
exports.__esModule = true
var zod_to_openapi_1 = require('@asteasolutions/zod-to-openapi')
var zod_1 = require('zod')
var yaml = require('yaml')
var fs = require('fs')
/**
 * SETUP
 */
;(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z)
var registry = new zod_to_openapi_1.OpenAPIRegistry()
/**
 * BASICS
 */
var UUID = '7e2e6a37-7924-4b86-a763-098894213b2f'
var id = zod_1.z.string().openapi({
  example: UUID,
})
var userId = registry.registerParameter(
  'userId',
  zod_1.z.string().openapi({
    param: {
      name: 'userId',
      in: 'path',
    },
    example: UUID,
  })
)
var degreeId = registry.registerParameter(
  'degreeId',
  zod_1.z.string().openapi({
    param: {
      name: 'degreeId',
      in: 'path',
    },
    example: UUID,
  })
)
var graphId = registry.registerParameter(
  'graphId',
  zod_1.z.string().openapi({
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
var UserSchema = registry.register(
  'User',
  zod_1.z.object({
    id: id,
    facebookId: zod_1.z.string(),
    googleId: zod_1.z.string(),
    githubId: zod_1.z.string(),
    displayName: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    matriculationYear: zod_1.z.number(),
    graduationYear: zod_1.z.number(),
    graduationSemester: zod_1.z.number(),
    modulesDone: zod_1.z.array(id),
    modulesDoing: zod_1.z.array(id),
    savedDegrees: zod_1.z.array(id),
    savedGraphs: zod_1.z.array(id),
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
    params: zod_1.z.object({ userId: userId }),
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
  var generator = new zod_to_openapi_1.OpenAPIGenerator(registry.definitions)
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
  var docs = getOpenApiDocumentation()
  // YAML equivalent
  var fileContent = yaml.stringify(docs)
  fs.writeFileSync(
    ''.concat(__dirname, '/../public/openapi-docs.yml'),
    fileContent,
    {
      encoding: 'utf-8',
    }
  )
}
writeDocumentation()
