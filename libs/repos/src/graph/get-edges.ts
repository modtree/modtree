import { Module, GraphFlowEdge } from '@modtree/types'

type BaseEdge = {
  source: string
  target: string
}

/**
 * gets a flow edge from two module codes
 *
 * @param {BaseEdge} props
 * @returns {GraphFlowEdge}
 */
function createFlowEdge(props: BaseEdge): GraphFlowEdge {
  const { source, target } = props
  return {
    id: source + '-' + target,
    source,
    target,
  }
}

export function getFlowEdges(modules: Module[]): GraphFlowEdge[] {
  const data: Record<string, GraphFlowEdge> = {}
  const codes = new Set(modules.map((m) => m.moduleCode))

  modules.forEach((module) => {
    /**
     * scan the pre-requisite tree
     */
    const pre = module.prereqTree
    if (typeof pre !== 'string') {
      /**
       * assemble direct children
       */
      const directSource: string[] = []
      pre.or?.forEach((tree) => {
        if (typeof tree === 'string') directSource.push(tree)
      })
      pre.and?.forEach((tree) => {
        if (typeof tree === 'string') directSource.push(tree)
      })
      /**
       * scan direct children for links
       */
      directSource.forEach((source) => {
        if (codes.has(source)) {
          const edge = createFlowEdge({ source, target: module.moduleCode })
          data[edge.id] = edge
        }
      })
    }
    /**
     * scan the post-requisite array
     */
    const post = module.fulfillRequirements
    if (typeof post === 'string') return
    post.forEach((target) => {
      if (codes.has(target)) {
        const edge = createFlowEdge({ source: module.moduleCode, target })
        data[edge.id] = edge
      }
    })
  })
  return Object.values(data)
}
