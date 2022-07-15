import { ModuleStatus } from '@modtree/types'
import { flatten } from '@modtree/utils'
import { validModuleRegex } from 'libs/utils/src/string/valid-module-code'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

const zUser = {
  authZeroId: z.string().length(30),
  email: z.string().email(),
}

export const user = createRouter()
  /**
   * get a user by id
   */
  .query('', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.userRepo.findOneById(req.input).then(flatten.user)
    },
  })

  /**
   * create a user
   */
  .mutation('/create', {
    input: z.object(zUser),
    async resolve(req) {
      const { authZeroId, email } = req.input
      return api.userRepo
        .initialize({
          authZeroId,
          email,
        })
        .then(flatten.user)
    },
  })

  /**
   * hard-deletes a user by id
   */
  .query('/delete', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input)
        .then((user) => api.userRepo.remove(user))
    },
  })

  /**
   * get a full user
   */
  .query('/get-full', {
    input: z.string().uuid(),
    async resolve(req) {
      console.log('GOT HERE')
      return api.userRepo.findOneById(req.input).then(flatten.userFull)
    },
  })

  /**
   * insert degrees into user
   */
  .mutation('/insert-degrees', {
    input: z.object({
      userId: z.string().uuid(),
      degreeIds: z.array(z.string().uuid()),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) => api.userRepo.insertDegrees(user, req.input.degreeIds))
        .then(flatten.user)
    },
  })

  /**
   * set main degree of user
   */
  .mutation('/set-main-degree', {
    input: z.object({
      userId: z.string().uuid(),
      degreeId: z.string().uuid(),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) => api.userRepo.setMainDegree(user, req.input.degreeId))
        .then(flatten.user)
    },
  })

  /**
   * remove degree from user
   */
  .mutation('/remove-degree', {
    input: z.object({
      userId: z.string().uuid(),
      degreeId: z.string().uuid(),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) => api.userRepo.removeDegree(user, req.input.degreeId))
        .then(flatten.user)
    },
  })

  /**
   * insert graphs into user
   */
  .mutation('/insert-graphs', {
    input: z.object({
      userId: z.string().uuid(),
      graphIds: z.array(z.string().uuid()),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) => api.userRepo.insertGraphs(user, req.input.graphIds))
        .then(flatten.user)
    },
  })

  /**
   * set main graph of user
   */
  .mutation('/set-main-graph', {
    input: z.object({
      userId: z.string().uuid(),
      graphId: z.string().uuid(),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) => api.userRepo.setMainGraph(user, req.input.graphId))
        .then(flatten.user)
    },
  })

  /**
   * remove graph from user
   */
  .mutation('/remove-graph', {
    input: z.object({
      userId: z.string().uuid(),
      graphId: z.string().uuid(),
    }),
    async resolve(_req) {
      return 'NOT IMPLEMENTED YET'
    },
  })

  /**
   * sets module status of a user
   */
  .mutation('/set-module-status', {
    input: z.object({
      userId: z.string().uuid(),
      moduleCodes: z.array(z.string().regex(validModuleRegex)),
      status: z.nativeEnum(ModuleStatus),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) =>
          api.userRepo.setModuleStatus(
            user,
            req.input.moduleCodes,
            req.input.status
          )
        )
        .then(flatten.user)
    },
  })

  /**
   * user login
   */
  .query('/login', {
    input: z.object({
      authZeroId: z.string().length(30),
      email: z.string().email(),
    }),
    async resolve(req) {
      return api
        .userLogin(req.input.authZeroId, req.input.email)
        .then(flatten.userFull)
    },
  })
