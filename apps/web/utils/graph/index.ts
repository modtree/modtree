import { Graph } from '@modtree/types'
import { DegreeGraphs } from 'types'
import { lowercaseAndDash } from '../string'

/**
 * Given graph, returns degree-title/graph-title.
 */
export function getUniqueGraphTitle(graph: Graph) {
  const degreeTitle = lowercaseAndDash(graph.degree.title)
  const graphTitle = lowercaseAndDash(graph.title)
  return degreeTitle + '/' + graphTitle
}

export function getGraphContent(graphs: Graph[]): DegreeGraphs[] {
  // convert into dictionary
  // key: degreeId, value: array of graphIds
  const dict: Record<string, string[]> = {}
  graphs.forEach((graph) => {
    const degreeTitle = lowercaseAndDash(graph.degree.title)
    const graphTitle = lowercaseAndDash(graph.title)
    if (Object.keys(dict).includes(degreeTitle)) {
      dict[degreeTitle].push(graphTitle)
    } else {
      dict[degreeTitle] = [graphTitle]
    }
  })
  // flatten dictionary
  const res: DegreeGraphs[] = []
  Object.entries(dict).forEach(([key, value]) => {
    res.push({
      degree: key,
      graphs: value,
    })
  })
  return res
}
