import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
} from 'react-flow-renderer'
import { initialNodes, initialEdges } from '@/flow/dag'
import { ModuleNode } from '@/components/flow/ModuleNode'
import { useSelector, useDispatch } from 'react-redux'
import { setFlowSelection, FlowState } from '@/store/flow'
import { FloatingActionButton } from '@/components/buttons'
import { BuilderState } from '@/store/builder'
import { FullScreenOverlay } from '@/components/Views'
import BuilderModal from '@/components/builder'
import Header from '@/components/header'
import { SearchState } from '@/store/search'
import { ModuleCondensed } from 'database'

const nodeTypes = { moduleNode: ModuleNode }

export default function Modtree() {
  const dispatch = useDispatch()
  const treeSelection = useSelector<FlowState, string>(
    (state) => state.flow.moduleCode
  )
  const showBuilder = useSelector<BuilderState, boolean>(
    (state) => state.builder.showBuilder
  )
  const searchResults = useSelector<SearchState, ModuleCondensed[]>(
    (state) => state.search.moduleCondensed
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

  const hide = (hidden: boolean) => (nodeOrEdge: any) => {
    nodeOrEdge.hidden = hidden
    return nodeOrEdge
  }

  useEffect(() => {
    console.log(treeSelection)
    console.log(searchResults)
  }, [treeSelection, searchResults])

  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setNodes((nds) =>
      nds.map((x) => {
        const whack = hide(hidden)
        if (x.id === 'CS2103T' || x.id === 'CS2102') {
          whack(x)
        }
        return x
      })
    )
    setEdges((eds) =>
      eds.map((x) => {
        const whack = hide(hidden)
        if (x.id === 'CS2030S-CS2103T' || x.id === 'yes') {
          whack(x)
        }
        return x
      })
    )
  }, [hidden])

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
          setHidden(!hidden)
          dispatch(setFlowSelection(moduleCodes))
        }}
        fitViewOptions={{ maxZoom: 1 }}
        defaultZoom={1}
        maxZoom={2}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
      <Header />
      <FullScreenOverlay>
        <FloatingActionButton />
        {showBuilder ? <BuilderModal /> : null}
      </FullScreenOverlay>
    </div>
  )
}
