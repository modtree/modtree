import { GraphFlowNode, GraphFrontendProps } from '@modtree/types'
import { getFlowEdges } from './get-edges'
import { getFlowNodes } from './get-nodes'

export const dagreify = (nodes: GraphFlowNode[]): GraphFrontendProps => {
  const flowEdges = getFlowEdges(nodes)
  const flowNodes = getFlowNodes(nodes, flowEdges)
  return { flowEdges, flowNodes }
}
