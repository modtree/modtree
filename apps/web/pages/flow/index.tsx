import { useCallback, useEffect, useState } from 'react'
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
  const [ctxCoord, setCtxCoord] = useState(['', ''])

  useEffect(() => {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      const xPos = event.pageX + 'px'
      const yPos = event.pageY + 'px'
      setCtxCoord([xPos, yPos])
      console.log('right clikced!', [xPos, yPos])
    })
  }, [])

  return (
    <div className="h-screen w-screen bg-green-100">
      <div style={{ top: ctxCoord[0], left: ctxCoord[1] }}>what is up</div>
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
