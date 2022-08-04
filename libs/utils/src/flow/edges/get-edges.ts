import { GraphFlowEdge, GraphFlowNode } from '@modtree/types'

/**
 * gets a flow edge from two module codes
 *
 * @param {string} source
 * @param {string} target
 * @returns {GraphFlowEdge}
 */
export function createFlowEdge(source: string, target: string): GraphFlowEdge {
  return {
    id: source + '-' + target,
    source,
    target,
  }
}

/**
 * returns a list of all direct sources/children/pre-requisite
 * of a graph node
 */

function getDirectSources(node: GraphFlowNode): string[] {
  const pre = node.data.prereqTree

  /** handle string prereqTrees */
  if (typeof pre === 'string') {
    if (pre === '') return []
    return [pre]
  }

  /** handle json prereqTrees */
  const directSources: string[] = []
  /**
   * assemble direct children
   */
  pre.or?.forEach((tree) => {
    if (typeof tree === 'string') directSources.push(tree)
  })
  pre.and?.forEach((tree) => {
    if (typeof tree === 'string') directSources.push(tree)
  })
  return directSources
}

export function getFlowEdges(nodes: GraphFlowNode[]): GraphFlowEdge[] {
  const edges: Record<string, GraphFlowEdge> = {}
  const codes = new Set(nodes.map((n) => n.data.moduleCode))

  nodes.forEach((node) => {
    const saveEdge = (source: string, target: string) => {
      /** don't save unrelated edges */
      if (!codes.has(source) || !codes.has(target)) return
      const edge = createFlowEdge(source, target)
      edges[edge.id] = edge
    }
    /**
     * scan sources
     */
    const directSources = getDirectSources(node)
    directSources.forEach((s) => saveEdge(s, node.data.moduleCode))
    /**
     * scan targets
     */
    const directTargets = node.data.fulfillRequirements
    if (typeof directTargets === 'string') return
    directTargets.forEach((t) => saveEdge(node.data.moduleCode, t))
  })

  return Object.values(edges)
}
