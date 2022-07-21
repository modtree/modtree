import { MouseEvent, useEffect, useMemo } from 'react'
import ReactFlow, { Node, Background, useReactFlow } from 'react-flow-renderer'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { onContextMenu } from '@/ui/menu/context-menu'
import {
  applyNodeChanges,
  setGraphSelectedCodes,
  setNodesAndEdges,
} from '@/store/modtree'
import { FlowControls } from './controls'
import { ModuleNode } from './module-node'
import { GraphFlowNode } from '@modtree/types'

export default function ModtreeFlow() {
  /** TODO: use node types to set state */
  const nodeTypes = useMemo(() => ({ moduleNode: ModuleNode }), [])

  /** hooks */
  const reactFlow = useReactFlow()
  const dispatch = useAppDispatch()
  const { flowNodes, flowEdges, selectedCodes } = useAppSelector(
    (s) => s.modtree.graph
  )

  /** Fit view for ANY graph change */
  useEffect(() => reactFlow.fitView({ maxZoom: 1 }), [flowNodes, flowEdges])

  /** called when user drops a module node. (after having dragged it) */
  const onNodeDragStop = (
    _event: MouseEvent,
    _droppedNode: Node,
    droppedNodes: GraphFlowNode[]
  ) => {
    const droppedIds = droppedNodes.map((d) => d.id)
    // revert selection state to before dragging
    const reselect = (node: GraphFlowNode) => ({
      ...node,
      selected: droppedIds.includes(node.id),
    })
    // update redux state
    dispatch(setNodesAndEdges(flowNodes.map(reselect)))
  }

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      /** hooks */
      onNodesChange={(chg) => dispatch(applyNodeChanges(chg))}
      onNodeDragStop={onNodeDragStop}
      onPaneContextMenu={(e) => onContextMenu(e, 'flowPaneContextMenu')}
      onNodeContextMenu={(e, node) => {
        onContextMenu(e, 'flowNodeContextMenu', node)
      }}
      onSelectionChange={(e) =>
        dispatch(setGraphSelectedCodes(e.nodes.map((n) => n.id)))
      }
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
