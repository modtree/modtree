import { useCallback, useState } from 'react'
import ReactFlow, {
  Controls,
  ReactFlowProps,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer'
import initialEdges from './edges'
import initialNodes from './nodes'

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
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  return (
    <div className="h-screen w-screen bg-green-100">
      <Flow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  )
}
