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
        tags: ['Graph'],
        summary: 'Create a graph',
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
        tags: ['Graph'],
        summary: 'Delete a graph',
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
        tags: ['Graph'],
        summary: 'Suggest modules from selected nodes of a graph',
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
   * Generate canTakes for the graph.
   *
   * For a single module, canTake is true when graph contains
   * enough pre-reqs to take it.
   */
  .query('can-take-modules', {
    meta: {
      openapi: {
        enabled: true,
        method: 'GET',
        path: '/graph/{graphId}/can-take-modules',
        tags: ['Graph'],
        summary:
          'For each module in the graph, checks if graph contains sufficient pre-reqs.',
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
        path: '/graph/{graphId}/rename',
        tags: ['Graph'],
        summary: 'Rename a graph',
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
    meta: {
      openapi: {
        enabled: true,
        method: 'PATCH',
        path: '/graph/{graphId}/update',
        tags: ['Graph'],
        summary: 'Update a graph',
      },
    },
    input: z.object({
      graphId: z.string().uuid(),
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
      return api.graphRepo
        .findOneById(input.graphId)
        .then((g) => api.graphRepo.update(g, input.graph))
        .then((res) => ({
          ...res,
          graph: flatten.graph(res.graph),
        }))
    },
  })
