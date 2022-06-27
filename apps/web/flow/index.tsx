import { MouseEvent, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Node,
  useNodesState,
  Background,
} from 'react-flow-renderer'
import { ModuleNode } from '@/components/flow/ModuleNode'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { onContextMenu } from '@/components/context-menu'
import { hideContextMenu } from '@/store/modal'
import { setGraphSelectedCodes, updateModuleNode } from '@/store/graph'

const nodeTypes = { moduleNode: ModuleNode }

export default function ModtreeFlow() {
  /**
   * redux dispatcher
   */
  const dispatch = useAppDispatch()
  const graph = useAppSelector((state) => state.graph)
  document.addEventListener('click', () => dispatch(hideContextMenu()))

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
      nodeTypes={nodeTypes}
      /** hooks */
      onNodesChange={onNodesChange}
      onNodeDragStop={onNodeDragStop}
      onPaneContextMenu={(e) => onContextMenu(dispatch, e, 'pane')}
      onNodeContextMenu={(e) => onContextMenu(dispatch, e, 'node')}
      onSelectionChange={(e) => dispatch(setGraphSelectedCodes(e.nodes))}
      /** pure configs */
      fitView={true}
      fitViewOptions={{ maxZoom: 1 }}
      zoomOnDoubleClick={false}
      defaultZoom={1}
      maxZoom={2}
    >
      <Controls showInteractive={false} />
      <Background />
    </ReactFlow>
  )
}
