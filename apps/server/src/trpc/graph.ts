import { flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const graph = createRouter()
  /**
   * create and save a graph
   */
  .mutation('create', {
    input: z.object({
      title: z.string().min(1).default('Untitled'),
      userId: z.string().uuid(),
      degreeId: z.string().uuid(),
    }),
    async resolve({ input }) {
      return api.graphRepo
        .initialize(input.title, input.userId, input.degreeId)
        .then(flatten.graph)
    },
  })

  /**
   * get a full graph by id
   */
  .query('get-full', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.graphRepo.findOneById(input)
    },
  })

  /**
   * hard-delete a graph
   */
  .query('delete', {
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.graphRepo.delete(input)
    },
  })

  /**
   * finds a graph by its id and updates a flow node
   */
  .query('suggest-modules', {
    input: z.object({
      graphId: z.string().uuid(),
      selectedCodes: z.array(z.string().regex(validModuleRegex)),
    }),
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
    input: z.string().uuid(),
    async resolve({ input }) {
      return api.graphRepo
        .findOneById(input)
        .then((g) => api.graphRepo.canTakeModules(g))
    },
  })

  /**
   * finds a graph by its id and update title
   */
  .mutation('rename', {
    input: z.object({
      graphId: z.string().uuid(),
      title: z.string(),
    }),
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
      graph: z.any(),
    }),
    async resolve({ input }) {
      return api.graphRepo.update(input.graph).then((res) => ({
        ...res,
        graph: flatten.graph(res.graph),
      }))
    },
  })
