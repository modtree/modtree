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
      id: z.string().uuid(),
    }),
    async resolve(req) {
      const { id, moduleCode } = req.input
      return api.graphRepo
        .findOneById(id)
        .then((g) => api.graphRepo.toggleModule(g, moduleCode))
        .then(flatten.graph)
    },
  })

  /**
   * finds a graph by its id and updates it with request props
   */
  .mutation('update-frontend-props', {
    input: z.object({
      id: z.string().uuid(),
      flowNodes: z.array(z.any()),
      flowEdges: z.array(z.any()),
    }),
    async resolve(req) {
      const { id, flowNodes, flowEdges } = req.input
      return api.graphRepo
        .findOneById(id)
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
      id: z.string().uuid(),
      flowNode: z.any(),
    }),
    async resolve(req) {
      const { id, flowNode } = req.input
      return api.graphRepo
        .findOneById(id)
        .then((g) => api.graphRepo.updateFlowNode(g, flowNode))
        .then(flatten.graph)
    },
  })

  /**
   * finds a graph by its id and updates a flow node
   */
  .query('suggest-modules', {
    input: z.object({
      id: z.string().uuid(),
      selectedCodes: z.array(z.string().regex(validModuleRegex)),
    }),
    async resolve(req) {
      const { id, selectedCodes } = req.input
      return api.graphRepo
        .findOneById(id)
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
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve(req) {
      const { id } = req.input
      return api.graphRepo
        .findOneById(id)
        .then((g) => api.graphRepo.canTakeModules(g))
    },
  })
