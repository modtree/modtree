import { flatten } from '@modtree/utils'
import { z } from 'zod'
import { createRouter } from './router'
import { api } from '../main'

export const list = createRouter()
  /** list all users */
  .query('users', {
    input: z.object({
      id: z.string().uuid().optional(),
      authZeroId: z.string().length(30).optional(),
      email: z.string().email().optional(),
    }),
    async resolve(req) {
      const { id, authZeroId, email } = req.input
      return api.userRepo
        .find({
          where: { id, authZeroId, email },
          relations: api.userRepo.relations,
        })
        .then((users) => users.map(flatten.user))
    },
  })

  /** list all degrees */
  .query('degrees', {
    input: z.array(z.string().uuid()),
    async resolve(req) {
      return api.degreeRepo
        .findByIds(req.input)
        .then((degrees) => degrees.map(flatten.degree))
    },
  })

  /** list all graphs */
  .query('graphs', {
    input: z.array(z.string().uuid()),
    async resolve(req) {
      return api.graphRepo
        .findByIds(req.input)
        .then((graphs) => graphs.map(flatten.graph))
    },
  })
