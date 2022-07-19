import { ModuleStatus } from '@modtree/types'
import { emptyInit, flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const user = createRouter()
  /**
   * create a user
   */
  .mutation('create', {
    input: z.object({
      authZeroId: z.string().length(30),
      email: z.string().email(),
    }),
    async resolve(req) {
      const { authZeroId, email } = req.input
      return api.userRepo
        .initialize({
          ...emptyInit.User,
          authZeroId,
          email,
        })
        .then(flatten.user)
    },
  })

  /**
   * hard-deletes a user by id
   */
  .query('delete', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.userRepo.delete(req.input)
    },
  })

  /**
   * get a full user
   */
  .query('get-full', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.userRepo.findOneById(req.input).then(flatten.user)
    },
  })

  /**
   * insert degrees into user
   */
  .mutation('insert-degrees', {
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
  .mutation('set-main-degree', {
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
  .mutation('remove-degree', {
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
  .mutation('insert-graphs', {
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
  .mutation('set-main-graph', {
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
  .mutation('remove-graph', {
    input: z.object({
      userId: z.string().uuid(),
      graphId: z.string().uuid(),
    }),
    async resolve(req) {
      return api.userRepo
        .findOneById(req.input.userId)
        .then((user) => api.userRepo.removeGraph(user, req.input.graphId))
        .then(flatten.user)
    },
  })

  /**
   * sets module status of a user
   */
  .mutation('set-module-status', {
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
  .mutation('login', {
    input: z.object({
      authZeroId: z.string().length(30),
      email: z.string().email(),
    }),
    async resolve(req) {
      return api
        .userLogin(req.input.authZeroId, req.input.email)
        .then(flatten.user)
    },
  })

  /**
   * get a user by email
   */
  .query('get-by-email', {
    input: z.string().email(),
    async resolve({ input }) {
      return api.userRepo.findOneByEmail(input).then(flatten.user)
    },
  })
