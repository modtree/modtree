import { ModuleStatus } from '@modtree/types'
import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const user = createRouter()
  /**
   * create a user
   */
  .mutation('create', {
    input: z.object({
      email: z.string().email(),
      provider: z.string().optional(),
      providerId: z.string().optional(),
    }),
    async resolve({ input }) {
      return api.userRepo
        .initialize(input.email, input.provider, input.providerId)
        .then(flatten.user)
    },
  })

  /**
   * hard-deletes a user by id
   */
  .query('delete', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.userRepo.delete(input)
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) => api.userRepo.insertDegrees(user, input.degreeIds))
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) => api.userRepo.setMainDegree(user, input.degreeId))
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) => api.userRepo.removeDegree(user, input.degreeId))
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) => api.userRepo.insertGraphs(user, input.graphIds))
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) => api.userRepo.setMainGraph(user, input.graphId))
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) => api.userRepo.removeGraph(user, input.graphId))
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
    async resolve({ input }) {
      return api.userRepo
        .findOneById(input.userId)
        .then((user) =>
          api.userRepo.setModuleStatus(user, input.moduleCodes, input.status)
        )
        .then(flatten.user)
    },
  })

  /**
   * user login
   */
  .mutation('login', {
    input: z.object({
      provider: z.string(),
      providerId: z.string().min(1),
      email: z.string().email(),
    }),
    async resolve({ input }) {
      return api
        .userLogin(input.email, input.provider, input.providerId)
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
