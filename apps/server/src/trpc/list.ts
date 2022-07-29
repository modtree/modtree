import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'
import { entities } from '../schemas/entities'

export const list = createRouter()
  /** list modules */
  .query('modules', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/modules',
        tags: ['Modules'],
        summary: 'Get many modules',
      },
    },
    input: z.object({
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    output: z.array(entities.Module),
    async resolve({ input }) {
      return api.moduleRepo.findByCodes(input.moduleCodes)
    },
  })

  /** list condensed modules */
  .query('modules-condensed', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/modules-condensed',
        tags: ['Modules'],
        summary: 'Get many modules condensed',
      },
    },
    input: z.object({
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    output: z.array(entities.ModuleCondensed),
    async resolve({ input }) {
      return api.moduleCondensedRepo.findByCodes(input.moduleCodes)
    },
  })

  /** list full modules */
  .query('modules-full', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/modules-full',
        tags: ['Modules'],
        summary: 'Get many modules full',
      },
    },
    input: z.object({
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    output: z.array(entities.ModuleFull),
    async resolve({ input }) {
      return api.moduleFullRepo.findByCodes(input.moduleCodes)
    },
  })

  /** list users */
  .query('users', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/users',
        tags: ['Users'],
        summary: 'Get many users',
      },
    },
    input: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
    }),
    output: z.array(entities.User),
    async resolve({ input }) {
      return api.userRepo
        .find({
          where: {
            id: input.id,
            email: input.email,
          },
          relations: api.userRepo.relations,
        })
        .then((users) => users.map(flatten.user))
    },
  })

  /** list degrees */
  .query('degrees', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/degrees',
        tags: ['Degrees'],
        summary: 'Get many degrees',
      },
    },
    input: z.object({
      degreeIds: z.array(z.string().uuid()),
    }),
    output: z.array(entities.Degree),
    async resolve({ input }) {
      return api.degreeRepo
        .findByIds(input.degreeIds)
        .then((degrees) => degrees.map(flatten.degree))
    },
  })

  /** list graphs */
  .query('graphs', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/graphs',
        tags: ['Graphs'],
        summary: 'Get many graphs',
      },
    },
    input: z.object({
      graphIds: z.array(z.string().uuid()),
    }),
    output: z.array(entities.Graph),
    async resolve({ input }) {
      return api.graphRepo
        .findByIds(input.graphIds)
        .then((graphs) => graphs.map(flatten.graph))
    },
  })
