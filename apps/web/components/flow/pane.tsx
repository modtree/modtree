import { MouseEvent, useEffect, useMemo } from 'react'
import ReactFlow, {
  Controls,
  Node,
  useNodesState,
  Background,
  useEdgesState,
  useReactFlow,
} from 'react-flow-renderer'
import { ModuleNode } from './module-node'
import store, { useAppDispatch, useAppSelector } from '@/store/redux'
import { onContextMenu } from '@/ui/menu/context-menu'
import { hideContextMenu } from '@/store/modal'
import { setGraphSelectedCodes, updateModuleNode } from '@/store/graph'
import { getCSS, redrawGraph } from '@/utils/module-state'
import { flatten } from '@modtree/utils'
import { api } from 'api'
import { ModuleSources } from '@modtree/types'

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
   * redux state
   */
  const user = useAppSelector((state) => state.user)

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

    // updates CSS after
    Promise.all([
      api.user.getById(user.id),
      api.graph.canTakeModules(graph.id),
    ]).then(([user, canTake]) => {
      getCSS(newNodes, user, canTake).then((nodes) => {
        setNodes(nodes)
      })
    })
  }, [graph.flowNodes, graph.id])

  /**
   * Fit view for ANY graph change
   * - nodes
   * - edges
   * - change graph
   */
  const reactFlow = useReactFlow()
  useEffect(() => {
    reactFlow.fitView()
  }, [nodes, edges])

  /**
   * called when user drops a module node. (after having dragged it)
   */
  const onNodeDragStop = (_: MouseEvent, node: Node) => {
    dispatch(updateModuleNode(node))
    const newNodes = redrawGraph({
      nodes,
      edges,
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
