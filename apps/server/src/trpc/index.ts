import { createRouter } from './router'
import { flatten } from '@modtree/utils'
import { user } from './user'
import { z } from 'zod'
import { api } from '../main'
import { graph } from './graph'
import { search } from './search'
import { degree } from './degree'

export const appRouter = createRouter()
  .merge('search/', search)
  .merge('degree/', degree)
  .merge('user/', user)
  .merge('graph/', graph)

  /** get a user by id */
  .query('user', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.userRepo.findOneById(req.input).then(flatten.user)
    },
  })

  /** get a degree by id */
  .query('degree', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.degreeRepo.findOneById(req.input).then(flatten.degree)
    },
  })

  /** get a graph by id */
  .query('graph', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.graphRepo.findOneById(req.input).then(flatten.graph)
    },
  })

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

export type AppRouter = typeof appRouter
