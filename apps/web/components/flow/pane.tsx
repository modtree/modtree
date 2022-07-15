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
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { onContextMenu } from '@/ui/menu/context-menu'
import { hideContextMenu } from '@/store/modal'
import { setGraphSelectedCodes } from '@/store/graph'
import { getCSS } from '@/utils/module-state'
import { redrawGraph } from '@modtree/utils'
import { api } from 'api'
import { trpcClient } from '@/utils/trpc'

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
        trpcClient.query('user/get-full', user.id),
        trpcClient.query('graph/can-take-modules', graph.id as any),
      ])
        .then(([user, canTake]) =>
          getCSS(newNodes, user.modulesDone, user.modulesDoing, canTake)
        )
        .then((nodes) => setNodes(nodes))
    }
  }, [graph.flowNodes, graph.id])

  // Update CSS of nodes, if modulesDone/modulesDoing has changed
  // Uses redux state user.
  useEffect(() => {
    const done = user.modulesDone
    const doing = user.modulesDoing
    if (graph.id) {
      api.graph
        .canTakeModules(graph.id)
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
  const onNodeDragStop = (_event: MouseEvent, _node: Node) => {
    setNodes(
      redrawGraph({
        nodes,
        edges,
      }).nodes
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
    >
      <Controls showInteractive={false} />
      <Background />
    </ReactFlow>
  )
}
