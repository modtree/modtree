import {
  extendZodWithOpenApi,
  OpenAPIGenerator,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import * as yaml from 'yaml'
import * as fs from 'fs'
import base from '../schemas/base'
import { entities, deletedEntities } from '../schemas/entities'

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
const moduleCode = registry.registerParameter('moduleCode', base.moduleCode)

/**
 * Register schemas
 */
const UserSchema = registry.register('User', entities.User)
const ModuleSchema = registry.register('Module', entities.Module)
const ModuleCondensedSchema = registry.register(
  'ModuleCondensed',
  entities.ModuleCondensed
)
const ModuleFullSchema = registry.register('ModuleFull', entities.ModuleFull)
const DegreeSchema = registry.register('Degree', entities.Degree)
const GraphSchema = registry.register('Graph', entities.Graph)
const DeletedUserSchema = registry.register('DeletedUser', deletedEntities.User)
const DeletedDegreeSchema = registry.register(
  'DeletedDegree',
  deletedEntities.Degree
)
const DeletedGraphSchema = registry.register(
  'DeletedGraph',
  deletedEntities.Graph
)

/**
 * With OpenAPI descriptions
 */
const schema = {
  User: UserSchema.openapi({ description: 'Flattened user object.' }),
  Module: ModuleSchema.openapi({
    description: 'Contains relevant information for an NUS module.',
  }),
  ModuleCondensed: ModuleCondensedSchema.openapi({
    description:
      'Contains the minimal amount of information for an NUS module.',
  }),
  ModuleFull: ModuleFullSchema.openapi({
    description: 'Contains all information for an NUS module.',
  }),
  Degree: DegreeSchema.openapi({ description: 'Flattened degree object.' }),
  Graph: GraphSchema.openapi({ description: 'Flattened graph object.' }),
  DeletedUser: DeletedUserSchema.openapi({
    description: 'Deleted user object. Does not include ID.',
  }),
  DeletedDegree: DeletedDegreeSchema.openapi({
    description: 'Deleted degree object. Does not include ID.',
  }),
  DeletedGraph: DeletedGraphSchema.openapi({
    description: 'Deleted graph object. Does not include ID.',
  }),
}

/**
 * Register routes
 */

/** GET ONE */
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
  tags: ['Degree'],
  method: 'get',
  path: '/degree/{degreeId}',
  description: 'Get degree data by its id',
  summary: 'Get a single degree',
  request: {
    params: z.object({ degreeId }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: schema.Degree,
    },
  },
})
registry.registerPath({
  tags: ['Graph'],
  method: 'get',
  path: '/graph/{graphId}',
  description: 'Get graph data by its id',
  summary: 'Get a single graph',
  request: {
    params: z.object({ graphId }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: schema.Graph,
    },
  },
})
registry.registerPath({
  tags: ['Module'],
  method: 'get',
  path: '/module/{moduleCode}',
  description: 'Get module data by its code',
  summary: 'Get a single module',
  request: {
    params: z.object({ moduleCode }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: schema.Module,
    },
  },
})
registry.registerPath({
  tags: ['ModuleFull'],
  method: 'get',
  path: '/module-full/{moduleCode}',
  description: 'Get module data by its code',
  summary: 'Get a single module',
  request: {
    params: z.object({ moduleCode }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: schema.ModuleFull,
    },
  },
})
registry.registerPath({
  tags: ['ModuleCondensed'],
  method: 'get',
  path: '/module-condensed/{moduleCode}',
  description: 'Get module data by its code',
  summary: 'Get a single module',
  request: {
    params: z.object({ moduleCode }),
  },
  responses: {
    200: {
      mediaType: 'application/json',
      schema: schema.ModuleCondensed,
    },
  },
})

/** mutations */
registry.registerPath({
  tags: ['User'],
  method: 'post',
  path: '/user',
  description: 'Creates a user after social authentication',
  summary: 'Create a user',
  request: {
    params: z.object({
      email: base.email,
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
