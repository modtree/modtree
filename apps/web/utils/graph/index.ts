import { Graph } from '@modtree/types'
import { flatten } from '@modtree/utils'
import { lowercaseAndDash } from '../string'

/**
 * Given graph, returns degree-title/graph-title.
 */
export function getUniqueGraphTitle(graph: Graph) {
  const degreeTitle = lowercaseAndDash(graph.degree.title)
  const graphTitle = lowercaseAndDash(graph.title)
  return degreeTitle + '/' + graphTitle
}

/**
 * Returns true if module in modulesPlaced.
 */
export function inModulesPlaced(graph: Graph, moduleCode: string) {
  const placed = graph.modulesPlaced.map(flatten.module)
  return placed.includes(moduleCode)
}
