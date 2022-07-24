import { ApiResponse } from '@modtree/types'
import { lowercaseAndDash } from '../string'

/**
 * Given graph, returns degree-title/graph-title.
 */
export function getUniqueGraphTitle(graph: ApiResponse.Graph) {
  const degreeTitle = lowercaseAndDash(graph.degree.title)
  const graphTitle = lowercaseAndDash(graph.title)
  return degreeTitle + '/' + graphTitle
}

/**
 * Returns true if module in modulesPlaced.
 */
export function inModulesPlaced(graph: ApiResponse.Graph, moduleCode: string) {
  return graph.flowNodes.map((n) => n.data.moduleCode).includes(moduleCode)
}
