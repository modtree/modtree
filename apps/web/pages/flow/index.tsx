import { useCallback, useState } from 'react'
import ReactFlow, {
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer'
import { initialNodes, initialEdges, ModuleNode } from './dag'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement } from '@/contexts/moduleSlice'

const nodeTypes = { moduleNode: ModuleNode }

type ReduxState = {
  counter: {
    value: number
  }
}

export default function Modtree() {
  const count = useSelector<ReduxState, number>(state => state.counter.value)
  const dispatch = useDispatch()

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
    <div className="h-screen w-screen bg-gray-50">
      <div className='p-10' onClick={() => dispatch(increment())}>increment</div>
      <div className='p-10' onClick={() => dispatch(decrement())}>decrement</div>
      <div className='p-10'>{count}</div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView={true}
        fitViewOptions={{maxZoom: 1}}
        defaultZoom={1}
        maxZoom={2}
      >
        <Controls />
      </ReactFlow>
    </div>
  )
}
