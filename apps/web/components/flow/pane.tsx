import { MouseEvent, useEffect, useMemo } from 'react'
import ReactFlow, {
  Node,
  useNodesState,
  Background,
  useEdgesState,
  useReactFlow,
} from 'react-flow-renderer'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { onContextMenu } from '@/ui/menu/context-menu'
import { hideContextMenu } from '@/store/modal'
import { setGraphSelectedCodes } from '@/store/graph'
import { getCSS } from '@/utils/module-state'
import { redrawGraph } from '@modtree/utils'
import { api } from 'api'
import { trpc } from '@/utils/trpc'
import { FlowControls } from './controls'
import { ModuleNode } from './module-node'
import { GraphFlowNode } from '@modtree/types'

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

    if (user.id && graph.id) {
      // updates CSS after
      // Redux state user is not detecting changes, so rely on API call for
      // updated user.
      Promise.all([
        api.user.getById(user.id),
        api.graph.canTakeModules(graph.id),
      ]).then(([user, canTake]) =>
        setNodes(getCSS(newNodes, user.modulesDone, user.modulesDoing, canTake))
      )
    }
  }, [graph.flowNodes, graph.id])

  // Update CSS of nodes, if modulesDone/modulesDoing has changed
  // Uses redux state user.
  useEffect(() => {
    const done = user.modulesDone
    const doing = user.modulesDoing
    if (graph.id) {
      trpc
        .query('graph/can-take-modules', graph.id)
        .then((canTake) => setNodes(getCSS(nodes, done, doing, canTake)))
    }
  }, [user.modulesDone, user.modulesDoing])

  /**
   * Fit view for ANY graph change
   * - nodes
   * - edges
   * - change graph
   */
  const reactFlow = useReactFlow()
  useEffect(() => {
    reactFlow.fitView({ maxZoom: 1 })
  }, [nodes, edges])

  /**
   * called when user drops a module node. (after having dragged it)
   */
  const onNodeDragStop = (
    _event: MouseEvent,
    _droppedNode: Node,
    droppedNodes: GraphFlowNode[]
  ) => {
    setNodes(
      redrawGraph({
        nodes,
        edges,
      }).nodes.map((node) => ({
        ...node,
        selected: droppedNodes.map((d) => d.id).includes(node.id),
      }))
    )
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
      deleteKeyCode={null}
    >
      <FlowControls />
      <Background />
    </ReactFlow>
  )
}
