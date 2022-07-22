'use strict'
exports.__esModule = true
var zod_to_openapi_1 = require('@asteasolutions/zod-to-openapi')
var zod_1 = require('zod')
var yaml = require('yaml')
var fs = require('fs')
var base_1 = require('../schemas/base')
/**
 * SETUP
 */
;(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z)
var registry = new zod_to_openapi_1.OpenAPIRegistry()
/**
 * Init path params
 */
var userId = registry.registerParameter('userId', base_1['default'].userId)
var degreeId = registry.registerParameter(
  'degreeId',
  base_1['default'].degreeId
)
var graphId = registry.registerParameter('graphId', base_1['default'].graphId)
/**
 * SCHEMAS
 */
var UserSchema = registry.register(
  'User',
  zod_1.z.object({
    id: base_1['default'].id,
    facebookId: zod_1.z.string(),
    googleId: zod_1.z.string(),
    githubId: zod_1.z.string(),
    displayName: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    matriculationYear: zod_1.z.number(),
    graduationYear: zod_1.z.number(),
    graduationSemester: zod_1.z.number(),
    modulesDone: zod_1.z.array(base_1['default'].id),
    modulesDoing: zod_1.z.array(base_1['default'].id),
    savedDegrees: zod_1.z.array(base_1['default'].id),
    savedGraphs: zod_1.z.array(base_1['default'].id),
    mainDegree: base_1['default'].id,
    mainGraph: base_1['default'].id,
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
  fs.writeFileSync(''.concat(__dirname, '/openapi-docs.yml'), fileContent, {
    encoding: 'utf-8',
  })
}
writeDocumentation()
