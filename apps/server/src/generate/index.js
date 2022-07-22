'use strict'
exports.__esModule = true
var zod_to_openapi_1 = require('@asteasolutions/zod-to-openapi')
var zod_1 = require('zod')
var yaml = require('yaml')
var fs = require('fs')
var base_1 = require('../schemas/base')
var entities_1 = require('../schemas/entities')
/**
 * SETUP
 */
;(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z)
var registry = new zod_to_openapi_1.OpenAPIRegistry()
/**
 * Register path params
 */
var userId = registry.registerParameter('userId', base_1['default'].userId)
var degreeId = registry.registerParameter(
  'degreeId',
  base_1['default'].degreeId
)
var graphId = registry.registerParameter('graphId', base_1['default'].graphId)
/**
 * Register schemas
 */
var UserSchema = registry.register('User', entities_1['default'].User)
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
