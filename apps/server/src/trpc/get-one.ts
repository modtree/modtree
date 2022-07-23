import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'
import { entities } from '../schemas/entities'

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
    input: z.string().regex(validModuleRegex),
    async resolve({ input }) {
      return api.moduleCondensedRepo.findByCode(input)
    },
  })

  /** get a full module by id */
  .query('module-full', {
    input: z.string().regex(validModuleRegex),
    async resolve({ input }) {
      return api.moduleFullRepo.findByCode(input)
    },
  })

  /** get a degree by id */
  .query('degree', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.degreeRepo.findOneById(input).then(flatten.degree)
    },
  })

  /** get a user by id */
  .query('user', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.userRepo.findOneById(input).then(flatten.user)
    },
  })

  /** get a graph by id */
  .query('graph', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.graphRepo.findOneById(input).then(flatten.graph)
    },
  })
