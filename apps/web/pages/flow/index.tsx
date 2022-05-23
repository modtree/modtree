import { useCallback, useState } from 'react'
import ReactFlow, {
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer'
import initialEdges from './edges'
import initialNodes from './nodes'

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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Controls />
      </ReactFlow>
    </div>
  )
}
