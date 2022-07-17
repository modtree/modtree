import { setGraph } from '@/store/graph'
import { trpc } from '@/utils/trpc'
import {
  CanTakeModuleMap,
  GraphFlowEdge,
  GraphFlowNode,
  InitGraphProps,
  ModtreeApiResponse,
} from '@modtree/types'
import { BaseApi } from './base-api'

export class GraphApi extends BaseApi {
  /**
   * get a graph by its id directly from database
   */
  async getById(graphId: string): Promise<ModtreeApiResponse.Graph> {
    return trpc.query('graph', graphId)
  }

  /**
   * toggle module in graph
   */
  async toggle(
    graphId: string,
    moduleCode: string
  ): Promise<ModtreeApiResponse.Graph> {
    return trpc.mutation('graph/toggle', { graphId, moduleCode }).then((g) => {
      this.dispatch(setGraph(g))
      return g
    })
  }

  /**
   * update frontend props
   */
  async updateFrontendProps(
    graphId: string,
    flowNodes: GraphFlowNode[],
    flowEdges: GraphFlowEdge[]
  ): Promise<ModtreeApiResponse.Graph> {
    return trpc.mutation('graph/update-frontend-props', {
      graphId,
      flowNodes,
      flowEdges,
    })
  }

  /**
   * create
   */
  async create(props: InitGraphProps): Promise<ModtreeApiResponse.Graph> {
    return trpc.mutation('graph/create', props)
  }

  /**
   * can take modules
   */
  async canTakeModules(graphId: string): Promise<CanTakeModuleMap> {
    return trpc.query('graph/can-take-modules', graphId)
  }

  /**
   * update title
   */
  async rename(
    graphId: string,
    title: string
  ): Promise<ModtreeApiResponse.Graph> {
    return trpc.mutation('graph/rename', { graphId, title })
  }
}
