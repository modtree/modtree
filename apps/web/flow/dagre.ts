import { GraphFlowEdge, GraphFlowNode } from '@modtree/types'
import type { SetState } from '@modtree/types'
import dagre from 'dagre'

const config = {
  ratio: 3,
}

export function setPosition(
  nodes: GraphFlowNode[],
  edges: GraphFlowEdge[],
  setNodes: SetState<GraphFlowNode[]>
) {
  const nodeRecord: Record<string, GraphFlowNode> = {}
  const positions: Record<string, { x: number; y: number }> = {}
  const g = new dagre.graphlib.Graph({ compound: false })
  g.setGraph({
    rankdir: 'LR',
    ranksep: 200,
    ranker: 'longest-path',
    // acyclicer: 'greedy'
  })
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))
  nodes.forEach((node) => {
    nodeRecord[node.id] = node
    g.setNode(node.id, {
      label: node.id,
      height: 24 * config.ratio,
      width: 40 * config.ratio,
    })
  })
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  /** compute the layout */
  dagre.layout(g)

  g.nodes().forEach((value) => {
    const { label, x, y } = g.node(value)
    positions[label] = { x, y }
  })
  const result: GraphFlowNode[] = nodes.map((node) => ({
    ...node,
    position: positions[node.id],
  }))
  setNodes(result)
}
