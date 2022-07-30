import { flatten } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { entities } from '../schemas/entities'
import { createRouter } from './router'

export const login = createRouter()
  /**
   * user login
   */
  .mutation('login', {
    meta: {
      openapi: {
        enabled: true,
        method: 'POST',
        path: '/login',
        tags: ['User'],
        summary: 'User login',
        description:
          'Performs user login. If there is no associated user in the database, creates a user with an empty degree and empty graph.',
      },
    },
    input: z.object({
      provider: z.string(),
      providerId: z.string().min(1),
      email: z.string().email(),
    }),
    output: entities.User,
    async resolve({ input }) {
      return api
        .userLogin(input.email, input.provider, input.providerId)
        .then(flatten.user)
    },
  })
