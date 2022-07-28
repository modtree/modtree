import { flatten } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'
import { entities } from '../schemas/entities'
import { parseCommaSeparatedString } from '../utils/parse'

export const list = createRouter()
  /** list modules */
  .query('modules', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/modules',
      },
    },
    input: z.object({
      moduleCodes: z.string().transform(parseCommaSeparatedString),
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
      },
    },
    input: z.object({
      moduleCodes: z.string().transform(parseCommaSeparatedString),
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
      },
    },
    input: z.object({
      moduleCodes: z.string().transform(parseCommaSeparatedString),
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
      },
    },
    input: z.object({
      degreeIds: z.string().transform(parseCommaSeparatedString),
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
      },
    },
    input: z.object({
      graphIds: z.string().transform(parseCommaSeparatedString),
    }),
    output: z.array(entities.Graph),
    async resolve({ input }) {
      return api.graphRepo
        .findByIds(input.graphIds)
        .then((graphs) => graphs.map(flatten.graph))
    },
  })
