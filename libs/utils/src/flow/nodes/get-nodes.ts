import {
  FlowNodeState,
  GraphFlowEdge,
  GraphFlowNode,
  IModule,
} from '@modtree/types'
import dagre from 'dagre'

const origin = { x: 0, y: 0 }

export function nodify(module: IModule, type: FlowNodeState): GraphFlowNode {
  return {
    id: module.moduleCode,
    position: origin,
    data: module,
    type,
  }
}

const config = {
  ratio: 3,
  graph: {
    rankdir: 'LR',
    ranksep: 200,
    ranker: 'network-simplex',
  },
}

export function getFlowNodes(
  nodes: GraphFlowNode[],
  edges: GraphFlowEdge[]
): GraphFlowNode[] {
  // init graph
  const positions: Record<string, { x: number; y: number }> = {}
  const g = new dagre.graphlib.Graph()
  g.setGraph(config.graph)
  g.setDefaultEdgeLabel(() => ({}))
  // set nodes
  nodes.forEach((node) => {
    g.setNode(node.id, {
      label: node.id,
      height: 24 * config.ratio,
      width: 40 * config.ratio,
    })
  })
  edges.forEach((edge) => g.setEdge(edge.source, edge.target))
  dagre.layout(g)
  g.nodes().forEach((value) => {
    const { label, x, y } = g.node(value)
    positions[label!] = { x, y }
  })
  return nodes.map((node) => ({
    ...node,
    position: positions[node.id],
  }))
}
