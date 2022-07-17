import { emptyInit, flatten, validModuleRegex } from '@modtree/utils'
import { z } from 'zod'
import { api } from '../main'
import { createRouter } from './router'

export const graph = createRouter()
  /**
   * create and save a graph
   */
  .mutation('create', {
    input: z.object({
      title: z.string().min(1),
      userId: z.string().uuid(),
      degreeId: z.string().uuid(),
    }),
    async resolve(req) {
      return api.graphRepo
        .initialize({ ...emptyInit.Graph, ...req.input })
        .then(flatten.graph)
    },
  })

  /**
   * get a full graph by id
   */
  .query('get-full', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.graphRepo.findOneById(req.input)
    },
  })

  /**
   * hard-delete a graph
   */
  .query('delete', {
    input: z.string().uuid(),
    async resolve(req) {
      return api.graphRepo.delete(req.input)
    },
  })

  /**
   * finds a graph by its id and toggles one module code
   */
  .mutation('toggle', {
    input: z.object({
      moduleCode: z.string().regex(validModuleRegex),
      graphId: z.string().uuid(),
    }),
    async resolve(req) {
      const { graphId, moduleCode } = req.input
      return api.graphRepo
        .findOneById(graphId)
        .then((g) => api.graphRepo.toggleModule(g, moduleCode))
        .then(flatten.graph)
    },
  })

  /**
   * finds a graph by its id and updates it with request props
   */
  .mutation('update-frontend-props', {
    input: z.object({
      graphId: z.string().uuid(),
      flowNodes: z.array(z.any()),
      flowEdges: z.array(z.any()),
    }),
    async resolve(req) {
      const { graphId, flowNodes, flowEdges } = req.input
      return api.graphRepo
        .findOneById(graphId)
        .then((g) =>
          api.graphRepo.updateFrontendProps(g, { flowNodes, flowEdges })
        )
        .then(flatten.graph)
    },
  })

  /**
   * finds a graph by its id and updates a flow node
   */
  .mutation('update-flow-node', {
    input: z.object({
      graphId: z.string().uuid(),
      flowNode: z.any(),
    }),
    async resolve(req) {
      const { graphId, flowNode } = req.input
      return api.graphRepo
        .findOneById(graphId)
        .then((g) => api.graphRepo.updateFlowNode(g, flowNode))
        .then(flatten.graph)
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
    async resolve(req) {
      const { graphId, selectedCodes } = req.input
      return api.graphRepo
        .findOneById(graphId)
        .then((g) => api.graphRepo.suggestModules(g, selectedCodes))
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
    async resolve(req) {
      return api.graphRepo
        .findOneById(req.input)
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
    async resolve(req) {
      const { graphId, title } = req.input
      return api.graphRepo
        .findOneById(graphId)
        .then((g) => api.graphRepo.rename(g, title))
        .then(flatten.graph)
    },
  })
