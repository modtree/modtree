import { useCallback, MouseEvent } from 'react'
import ReactFlow, {
  Controls,
  Node,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer'
import { initialNodes, initialEdges } from '@/flow/graph'
import { ModuleNode } from '@/components/flow/ModuleNode'
import { useDispatch } from 'react-redux'
import { setFlowSelection, setFlowNodes } from '@/store/flow'

const nodeTypes = { moduleNode: ModuleNode }

export default function ModtreeFlow() {
  /**
   * redux dispatcher
   */
  const dispatch = useDispatch()

  /**
   * retrieve redux state for tree selection
   * (Array of selected module nodes)
   */
  // const flowSelection = useSelector<FlowState, string[]>(
  //   (state) => state.flow.selection
  // )

  /**
   * builtin react flow hooks that handle node/edge movement
   * here, the variables `nodes` and `edges` store the current state of all
   * nodes and edges on-screen.
   */
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  console.log(setEdges.name)

  /**
   * called when user drops a module node. (after having dragged it)
   */
  const onNodeDragStop = useCallback(
    (_: MouseEvent, node: Node) => {
      console.log('released a node')
      console.log('current nodes state:', nodes)
      console.log('current edges state:', edges)
      console.log('node that moved:', node)
      dispatch(setFlowNodes(nodes))
    },
    [setNodes]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      zoomOnDoubleClick={false}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDragStop={onNodeDragStop}
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
  )
}
