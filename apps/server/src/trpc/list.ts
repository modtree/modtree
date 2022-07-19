import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'

export const list = createRouter()
  /** list modules */
  .query('modules', {
    input: z.array(z.string().regex(validModuleRegex)),
    async resolve(req) {
      return api.moduleRepo.findByCodes(req.input)
    },
  })

  /** list condensed modules */
  .query('modules-condensed', {
    input: z.array(z.string().regex(validModuleRegex)),
    async resolve(req) {
      return api.moduleCondensedRepo.findByCodes(req.input)
    },
  })

  /** list full modules */
  .query('modules-full', {
    input: z.array(z.string().regex(validModuleRegex)),
    async resolve(req) {
      return api.moduleFullRepo.findByCodes(req.input)
    },
  })

  /** list users */
  .query('users', {
    input: z.object({
      id: z.string().uuid().optional(),
      email: z.string().email().optional(),
    }),
    async resolve(req) {
      const { id, email } = req.input
      return api.userRepo
        .find({
          where: { id, email },
          relations: api.userRepo.relations,
        })
        .then((users) => users.map(flatten.user))
    },
  })

  /** list degrees */
  .query('degrees', {
    input: z.array(z.string().uuid()),
    async resolve(req) {
      return api.degreeRepo
        .findByIds(req.input)
        .then((degrees) => degrees.map(flatten.degree))
    },
  })

  /** list graphs */
  .query('graphs', {
    input: z.array(z.string().uuid()),
    async resolve(req) {
      return api.graphRepo
        .findByIds(req.input)
        .then((graphs) => graphs.map(flatten.graph))
    },
  })
