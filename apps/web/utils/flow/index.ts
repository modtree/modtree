import { GraphFlowEdge, GraphFlowNode } from '@modtree/types'
import { getFlowEdges } from '@modtree/utils'
import { getFlowNodes } from './get-nodes'

type NodesAndEdges = {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
}

export function redrawGraph(props: NodesAndEdges): NodesAndEdges {
  const [nodes, edges] = [
    getFlowNodes(props.nodes, props.edges),
    getFlowEdges(props.nodes.map((n) => n.data)),
  ]
  const result = {
    nodes,
    edges,
  }
  console.log(result)
  return result
}
