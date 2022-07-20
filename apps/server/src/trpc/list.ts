import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'

export const list = createRouter()
  /** list modules */
  .query('modules', {
    input: z.array(z.string().regex(validModuleRegex)),
    async resolve({ input }) {
      return api.moduleRepo.findByCodes(input)
    },
  })

  /** list condensed modules */
  .query('modules-condensed', {
    input: z.array(z.string().regex(validModuleRegex)),
    async resolve({ input }) {
      return api.moduleCondensedRepo.findByCodes(input)
    },
  })

  /** list full modules */
  .query('modules-full', {
    input: z.array(z.string().regex(validModuleRegex)),
    async resolve({ input }) {
      return api.moduleFullRepo.findByCodes(input)
    },
  })

  /** list users */
  .query('users', {
    input: z.object({
      id: z.string().uuid().optional(),
      email: z.string().email().optional(),
    }),
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
    input: z.array(z.string().uuid()),
    async resolve({ input }) {
      return api.degreeRepo
        .findByIds(input)
        .then((degrees) => degrees.map(flatten.degree))
    },
  })

  /** list graphs */
  .query('graphs', {
    input: z.array(z.string().uuid()),
    async resolve({ input }) {
      return api.graphRepo
        .findByIds(input)
        .then((graphs) => graphs.map(flatten.graph))
    },
  })
