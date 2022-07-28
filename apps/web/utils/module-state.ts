import { GraphFlowNode, CanTakeModule, FlowNodeState } from '@modtree/types'

/**
 * canTake tells you if you can take each module in the graph,
 * having taken the rest of the modules.
 */
export function getCSS(
  nodes: GraphFlowNode[],
  done: string[],
  doing: string[],
  canTake: CanTakeModule[]
): GraphFlowNode[] {
  const getState = (moduleCode: string): FlowNodeState => {
    // done/doing
    if (done.includes(moduleCode)) return 'done'
    if (doing.includes(moduleCode)) return 'doing'
    // planned
    return canTake.find((m) => m.moduleCode === moduleCode)?.canTake
      ? 'planned'
      : 'cannotTake'
  }

  return nodes.map((node) => ({
    ...node,
    type: getState(node.data.moduleCode),
  }))
}
