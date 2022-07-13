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
import { setGraphSelectedCodes, updateModuleNode } from '@/store/graph'
import { getCSS } from '@/utils/module-state'
import { redrawGraph } from '@modtree/utils'
import { api } from 'api'

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
    // Redux state user is not detecting changes, so rely on API call for
    // updated user.
    Promise.all([
      api.user.getById(user.id),
      api.graph.canTakeModules(graph.id),
    ]).then(([user, canTake]) => {
      const done = user.modulesDone
      const doing = user.modulesDoing
      getCSS(newNodes, done, doing, canTake).then((nodes) => {
        setNodes(nodes)
      })
    })
  }, [graph.flowNodes, graph.id])

  // Update CSS of nodes, if modulesDone/modulesDoing has changed
  // Uses redux state user.
  useEffect(() => {
    const done = user.modulesDone
    const doing = user.modulesDoing
    Promise.all([done, doing, api.graph.canTakeModules(graph.id)]).then(
      ([done, doing, canTake]) => {
        getCSS(nodes, done, doing, canTake).then((nodes) => {
          setNodes(nodes)
        })
      }
    )
  }, [user.modulesDone, user.modulesDoing])

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
