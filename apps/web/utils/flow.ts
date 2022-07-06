import { getPosition } from '@/flow/dagre'
import { GraphFlowEdge, GraphFlowNode } from '@modtree/types'
import { getFlowEdges } from '@modtree/utils'

type NodesAndEdges = {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
}
export function redrawGraph(props: NodesAndEdges): NodesAndEdges {
  const [nodes, edges] = [
    getPosition(props.nodes, props.edges),
    getFlowEdges(props.nodes.map((n) => n.data)),
  ]
  const result = {
    nodes,
    edges,
  }
  console.log(result)
  return result
}
