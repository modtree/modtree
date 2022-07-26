import { flatten } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'
import { base, entities } from '../schemas/entities'
import { parseCommaSeparatedString } from '../utils/parse'

export const list = createRouter()
  /** list modules */
  .query('modules', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Module'],
        method: 'GET',
        path: '/modules',
        summary: 'Get many modules',
      },
    },
    input: z.object({
      moduleCodes: z.string(),
    }),
    output: z.array(entities.Module),
    async resolve({ input }) {
      /** parse string separately */
      const moduleCodes = parseCommaSeparatedString(input.moduleCodes)
      return api.moduleRepo.findByCodes(moduleCodes)
    },
  })

  /** list condensed modules */
  .mutation('modules-condensed', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Module'],
        method: 'POST',
        path: '/modules-condensed',
        summary: 'Get many modules condensed',
      },
    },
    input: z.object({
      moduleCodes: base.moduleCodeArray,
    }),
    output: z.array(entities.ModuleCondensed),
    async resolve({ input }) {
      return api.moduleCondensedRepo.findByCodes(input.moduleCodes)
    },
  })

  /** list full modules */
  .mutation('modules-full', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Module'],
        method: 'POST',
        path: '/modules-full',
        summary: 'Get many modules full',
      },
    },
    input: z.object({
      moduleCodes: base.moduleCodeArray,
    }),
    output: z.array(entities.ModuleFull),
    async resolve({ input }) {
      return api.moduleFullRepo.findByCodes(input.moduleCodes)
    },
  })

  /** list users */
  .mutation('users', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['User'],
        method: 'POST',
        path: '/users',
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
  .mutation('degrees', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Degree'],
        method: 'POST',
        path: '/degrees',
        summary: 'Get many degrees',
      },
    },
    input: z.object({
      degreeIds: base.idArray,
    }),
    output: z.array(entities.Degree),
    async resolve({ input }) {
      return api.degreeRepo
        .findByIds(input.degreeIds)
        .then((degrees) => degrees.map(flatten.degree))
    },
  })

  /** list graphs */
  .mutation('graphs', {
    meta: {
      openapi: {
        enabled: true,
        tags: ['Graph'],
        method: 'POST',
        path: '/graphs',
        summary: 'Get many graphs',
      },
    },
    input: z.object({
      graphIds: base.idArray,
    }),
    output: z.array(entities.Graph),
    async resolve({ input }) {
      return api.graphRepo
        .findByIds(input.graphIds)
        .then((graphs) => graphs.map(flatten.graph))
    },
  })
