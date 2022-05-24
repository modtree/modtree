import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer'
import { initialNodes, initialEdges, ModuleNode } from './dag'
import { useSelector, useDispatch } from 'react-redux'
import { setTreeSelection } from '@/store/treeSelection'

const nodeTypes = { moduleNode: ModuleNode }

type ReduxState = {
  counter: {
    value: number
  }
  treeSelection: {
    moduleCode: string
  }
}

export default function Modtree() {
  const dispatch = useDispatch()
  const treeSelection = useSelector<ReduxState, string>(
    (state) => state.treeSelection.moduleCode
  )
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

  useEffect(() => {
    console.log(treeSelection)
  }, [treeSelection])

  return (
    <div className="h-screen w-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        zoomOnDoubleClick={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView={true}
        onSelectionChange={(e) => {
          const moduleCodes = e.nodes.map((x) => x.data.moduleCode)
          dispatch(setTreeSelection(moduleCodes))
        }}
        fitViewOptions={{ maxZoom: 1 }}
        defaultZoom={1}
        maxZoom={2}
      >
        <Controls />
      </ReactFlow>
    </div>
  )
}
