import { GraphFlowEdge, GraphFlowNode } from '@modtree/types'
import { getFlowEdges } from './get-edges'
import { getFlowNodes } from './get-nodes'

type NodesAndEdges = {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
}

export const redrawGraph = (props: NodesAndEdges): NodesAndEdges => ({
  nodes: getFlowNodes(props.nodes, props.edges),
  edges: getFlowEdges(props.nodes),
})
