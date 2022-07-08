import { MouseEvent, useEffect, useMemo } from 'react'
import ReactFlow, {
  Controls,
  Node,
  useNodesState,
  Background,
  useEdgesState,
} from 'react-flow-renderer'
import { ModuleNode } from './module-node'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { onContextMenu } from '@/ui/menu/context-menu'
import { hideContextMenu } from '@/store/modal'
import { setGraphSelectedCodes, updateModuleNode } from '@/store/graph'
import { redrawGraph } from '@/utils/flow'

export default function ModtreeFlow() {
  const nodeTypes = useMemo(
    () => ({
      moduleNode: ModuleNode,
    }),
    []
  )
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
  const [edges, setEdges] = useEdgesState(graph.flowEdges)

  useEffect(() => {
    setEdges(graph.flowEdges)
    const newNodes = redrawGraph({
      nodes: graph.flowNodes,
      edges: graph.flowEdges,
    }).nodes
    setNodes(newNodes)
  }, [graph.flowNodes.length])

  /**
   * called when user drops a module node. (after having dragged it)
   */
  const onNodeDragStop = (_: MouseEvent, node: Node) => {
    dispatch(updateModuleNode(node))
    const newNodes = redrawGraph({
      nodes: graph.flowNodes,
      edges: graph.flowEdges,
    }).nodes
    setNodes(newNodes)
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      /** hooks */
      onNodesChange={onNodesChange}
      onNodeDragStop={onNodeDragStop}
      onPaneContextMenu={(e) =>
        onContextMenu(dispatch, e, 'flowPaneContextMenu')
      }
      onNodeContextMenu={(e, node) =>
        onContextMenu(dispatch, e, 'flowNodeContextMenu', node)
      }
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
