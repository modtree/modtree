import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from 'react-flow-renderer'
import { initialNodes, initialEdges } from '@/flow/dag'
import { ModuleNode } from '@/components/flow/ModuleNode'
import { useSelector, useDispatch } from 'react-redux'
import { setFlowSelection, FlowState } from '@/store/flow'
import { FloatingActionButton } from '@/components/buttons'
import { BuilderState } from '@/store/builder'
import { FullScreenOverlay, HeaderOverlay } from '@/components/Views'
import BuilderModal from '@/components/builder'
import Header from '@/components/Header'

const nodeTypes = { moduleNode: ModuleNode }

export default function Modtree() {
  const dispatch = useDispatch()
  const treeSelection = useSelector<FlowState, string>(
    (state) => state.flow.moduleCode
  )
  const showBuilder = useSelector<BuilderState, boolean>(
    (state) => state.builder.showBuilder
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
          dispatch(setFlowSelection(moduleCodes))
        }}
        fitViewOptions={{ maxZoom: 1 }}
        defaultZoom={1}
        maxZoom={2}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
      <Header/>
      <FullScreenOverlay>
        <FloatingActionButton />
        {showBuilder ? <BuilderModal /> : null}
      </FullScreenOverlay>
    </div>
  )
}
