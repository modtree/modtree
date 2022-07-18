import {
  FlowNodeState as State,
  GraphFlowNode,
  CanTakeModule,
} from '@modtree/types'

const cssMap = {
  [State.DONE]: { moduleCode: 'text-emerald-500 opacity-80' },
  [State.DOING]: { moduleCode: 'text-black opacity-100' },
  [State.PLAN_CANNOT_TAKE]: { moduleCode: 'text-red-400 opacity-100' },
  [State.PLAN_CAN_TAKE]: { moduleCode: 'text-gray-400 opacity-100' },
  [State.SUGGESTED]: { moduleCode: 'text-gray-400 opacity-50' },
}

/**
 * canTake tells you if you can take each module in the graph,
 * having taken the rest of the modules.
 *
 */
export function getCSS(
  nodes: GraphFlowNode[],
  done: string[],
  doing: string[],
  canTake: CanTakeModule[]
) {
  const getState = (moduleCode: string): State => {
    // done/doing
    if (done.includes(moduleCode)) return State.DONE
    if (doing.includes(moduleCode)) return State.DOING
    // planned
    return canTake.find((m) => m.moduleCode === moduleCode)?.canTake
      ? State.PLAN_CAN_TAKE
      : State.PLAN_CANNOT_TAKE
  }

  return nodes.map((node) => ({
    ...node,
    state: getState(node.data.moduleCode),
    data: {
      ...node.data,
      className: cssMap[getState(node.data.moduleCode)],
    },
  }))
}
