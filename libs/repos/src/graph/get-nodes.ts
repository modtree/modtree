import { GraphFlowEdge, GraphFlowNode, Module } from '@modtree/types'
export * from './get-edges'
import dagre from 'dagre'
import { nodify } from '@modtree/utils'

export function getFlowNodes(
  modules: Module[],
  edges: GraphFlowEdge[]
): GraphFlowNode[] {
  const g = new dagre.graphlib.Graph()
  g.setGraph({})
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))
  modules.forEach((module) => {
    g.setNode(module.moduleCode, {
      label: module.moduleCode,
    })
  })
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  /** compute the layout */
  dagre.layout(g)

  return modules.map((m) => nodify(m, 'planned'))
}
