'use strict'
exports.__esModule = true
var zod_to_openapi_1 = require('@asteasolutions/zod-to-openapi')
var zod_1 = require('zod')
var yaml = require('yaml')
var fs = require('fs')
;(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z)
var registry = new zod_to_openapi_1.OpenAPIRegistry()
var UserIdSchema = registry.registerParameter(
  'UserId',
  zod_1.z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '1212121',
  })
)
var UserSchema = registry.register(
  'User',
  zod_1.z.object({
    id: zod_1.z.string().openapi({
      example: '1212121',
    }),
    name: zod_1.z.string().openapi({
      example: 'John Doe',
    }),
    age: zod_1.z.number().openapi({
      example: 42,
    }),
  })
)
registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  description: 'Get user data by its id',
  summary: 'Get a single user',
  request: {
    params: zod_1.z.object({ id: UserIdSchema }),
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
      title: 'My API',
      description: 'This is the API',
    },
    servers: [{ url: 'v1' }],
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
