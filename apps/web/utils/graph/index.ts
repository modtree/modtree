import { ApiResponse } from '@modtree/types'
import { lowercaseAndDash } from '../string'

/**
 * Given graph, returns degree-title/graph-title.
 */
export function getUniqueGraphTitle(graph: ApiResponse.Graph): string {
  const degreeTitle = lowercaseAndDash(graph.degree.title)
  const graphTitle = lowercaseAndDash(graph.title)
  return degreeTitle + '/' + graphTitle
}

/**
 * Returns true if module in flow nodes.
 */
export function inFlowNodes(
  graph: ApiResponse.Graph,
  moduleCode: string
): boolean {
  return graph.flowNodes.map((n) => n.data.moduleCode).includes(moduleCode)
}
