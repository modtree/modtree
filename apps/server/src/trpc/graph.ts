import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { deleteResult, entities } from '../schemas/entities'
import { createRouter } from './router'

export const graph = createRouter()
  /**
   * create and save a graph
   */
  .mutation('create', {
    meta: {
      openapi: {
        enabled: true,
        method: 'POST',
        path: '/graph',
      },
    },
    input: z.object({
      title: z.string().min(1).default('Untitled'),
      userId: z.string().uuid(),
      degreeId: z.string().uuid(),
    }),
    output: entities.Graph,
    async resolve({ input }) {
      return api.graphRepo
        .initialize(input.title, input.userId, input.degreeId)
        .then(flatten.graph)
    },
  })

  /**
   * hard-delete a graph
   */
  .query('delete', {
    meta: {
      openapi: {
        enabled: true,
        method: 'DELETE',
        path: '/graph/{graphId}',
      },
    },
    input: z.object({
      graphId: z.string().uuid(),
    }),
    output: deleteResult,
    async resolve({ input }) {
      return api.graphRepo.delete(input.graphId)
    },
  })

  /**
   * suggest modules
   */
  .query('suggest-modules', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/graph/{graphId}/suggest-modules',
      },
    },
    input: z.object({
      graphId: z.string().uuid(),
      selectedCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    /* array of module codes */
    output: z.array(z.string().regex(validModuleRegex)),
    async resolve({ input }) {
      return api.graphRepo
        .findOneById(input.graphId)
        .then((g) => api.graphRepo.suggestModules(g, input.selectedCodes))
        .then((m) => m.map(flatten.module))
    },
  })

  /**
   * For a single module, return true if graph contains enough pre-reqs
   * to take it.
   *
   * Returns a dictionary keyed on moduleCode.
   */
  .query('can-take-modules', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/graph/{graphId}/can-take-modules',
      },
    },
    input: z.object({
      graphId: z.string().uuid(),
    }),
    output: z.array(
      z.object({
        moduleCode: z.string().regex(validModuleRegex),
        canTake: z.boolean(),
      })
    ),
    async resolve({ input }) {
      return api.graphRepo
        .findOneById(input.graphId)
        .then((g) => api.graphRepo.canTakeModules(g))
    },
  })

  /**
   * finds a graph by its id and update title
   */
  .mutation('rename', {
    meta: {
      openapi: {
        enabled: true,
        method: 'PATCH',
        path: '/graph/{graphId}',
      },
    },
    input: z.object({
      graphId: z.string().uuid(),
      title: z.string(),
    }),
    output: entities.Graph,
    async resolve({ input }) {
      return api.graphRepo
        .findOneById(input.graphId)
        .then((g) => api.graphRepo.save({ ...g, title: input.title }))
        .then(flatten.graph)
    },
  })

  /**
   * updates a graph
   */
  .mutation('update', {
    input: z.object({
      graph: entities.Graph,
    }),
    output: z.object({
      graph: entities.Graph,
      canTakes: z.array(
        z.object({
          moduleCode: z.string(),
          canTake: z.boolean(),
        })
      ),
    }),
    async resolve({ input }) {
      return api.graphRepo.update(input.graph).then((res) => ({
        ...res,
        graph: flatten.graph(res.graph),
      }))
    },
  })
