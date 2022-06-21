import { MouseEvent, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Node,
  useNodesState,
  Background,
} from 'react-flow-renderer'
import { ModuleNode } from '@/components/flow/ModuleNode'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { setFlowSelection } from '@/store/flow'
import { onContextMenu } from '@/components/context-menu'
import { updateModuleNode } from '@/store/base'

const nodeTypes = { moduleNode: ModuleNode }

export default function ModtreeFlow() {
  /**
   * redux dispatcher
   */
  const dispatch = useAppDispatch()
  const graph = useAppSelector((state) => state.base.graph)

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
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.flowNodes)

  useEffect(() => {
    // console.log('redux graph flow nodes changed')
    // console.log('graph.flowNodes', graph.flowNodes)
    setNodes(graph.flowNodes)
  }, [graph.flowNodes.length])

  /**
   * called when user drops a module node. (after having dragged it)
   */
  const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => {
    // console.log('released a node')
    console.log('dragged node:', node.id)
    console.log('current nodes state:', nodes)
    dispatch(updateModuleNode(node))
  }

  return (
    <ReactFlow
      nodes={nodes}
      zoomOnDoubleClick={false}
      onNodesChange={onNodesChange}
      onNodeDragStop={onNodeDragStop}
      onPaneContextMenu={(e) => onContextMenu(dispatch, e, 'pane')}
      onNodeContextMenu={(e) => onContextMenu(dispatch, e, 'node')}
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
      <Background />
    </ReactFlow>
  )
}
