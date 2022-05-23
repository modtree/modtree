import { useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Node,
  Edge,
  ReactFlowProps,
} from 'react-flow-renderer'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
    draggable: true,
    selectable: true,
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
]

function Flow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: ReactFlowProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
    </ReactFlow>
  )
}

export default function Modtree() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  return (
    <div className="h-screen w-screen bg-green-100">
      <Flow nodes={initialNodes} edges={initialEdges} />
    </div>
  )
}
