import { GraphFlowNode, GraphFrontendProps } from '@modtree/types'
import { getFlowEdges } from './edges'
import { getFlowNodes } from './nodes'

export const dagreify = (nodes: GraphFlowNode[]): GraphFrontendProps => {
  const flowEdges = getFlowEdges(nodes)
  const flowNodes = getFlowNodes(nodes, flowEdges)
  return { flowEdges, flowNodes }
}
