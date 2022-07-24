import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'
import { base, entities } from '../schemas/entities'

export const getOne = createRouter()
  /** get a module by id */
  .query('module', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Module'],
        method: 'GET',
        path: '/module/{moduleCode}',
        summary: 'Get a single module',
      },
    },
    input: z.object({
      moduleCode: z.string().regex(validModuleRegex),
    }),
    output: entities.Module,
    async resolve({ input }) {
      return api.moduleRepo.findByCode(input.moduleCode)
    },
  })

  /** get a condensed module by id */
  .query('module-condensed', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Module'],
        method: 'GET',
        path: '/module-condensed/{moduleCode}',
        summary: 'Get a single module condensed',
      },
    },
    input: z.object({
      moduleCode: z.string().regex(validModuleRegex),
    }),
    output: entities.ModuleCondensed,
    async resolve({ input }) {
      return api.moduleCondensedRepo.findByCode(input.moduleCode)
    },
  })

  /** get a full module by id */
  .query('module-full', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Module'],
        method: 'GET',
        path: '/module-full/{moduleCode}',
        summary: 'Get a single module full',
      },
    },
    input: z.object({
      moduleCode: z.string().regex(validModuleRegex),
    }),
    output: entities.ModuleFull,
    async resolve({ input }) {
      return api.moduleFullRepo.findByCode(input.moduleCode)
    },
  })

  /** get a degree by id */
  .query('degree', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Degree'],
        method: 'GET',
        path: '/degree/{degreeId}',
        summary: 'Get a single degree',
      },
    },
    input: z.object({
      degreeId: z.string().uuid(),
    }),
    output: entities.Degree,
    async resolve({ input }) {
      return api.degreeRepo.findOneById(input.degreeId).then(flatten.degree)
    },
  })

  /** get a user by id */
  .query('user', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['User'],
        method: 'GET',
        path: '/user/{userId}',
        summary: 'Get a single user',
      },
    },
    input: z.object({
      userId: z.string().uuid(),
    }),
    output: entities.User,
    async resolve({ input }) {
      return api.userRepo.findOneById(input.userId).then(flatten.user)
    },
  })

  /** get a graph by id */
  .query('graph', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Graph'],
        method: 'GET',
        path: '/graph/{graphId}',
        summary: 'Get a single graph',
      },
    },
    input: z.object({
      graphId: z.string().uuid(),
    }),
    output: entities.Graph,
    async resolve({ input }) {
      return api.graphRepo.findOneById(input.graphId).then(flatten.graph)
    },
  })
