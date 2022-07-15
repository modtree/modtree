import { createRouter } from './router'
import { flatten } from '@modtree/utils'
import { user } from './user'
import { z } from 'zod'
import { api } from '../main'

export const appRouter = createRouter()
  .merge('user', user)
  /**
   * list all users
   */
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

export type AppRouter = typeof appRouter
