import {
  ModuleStateDict,
  FrontendModuleState,
  GraphFlowNode,
  CanTakeModuleMap,
  ModuleSources,
} from '@modtree/types'

const cssMap = {
  [FrontendModuleState.DONE]: { color: 'green', opacity: '50%' },
  [FrontendModuleState.DOING]: { color: 'black', opacity: '100%' },
  [FrontendModuleState.PLAN_CANNOT_TAKE]: { color: 'red', opacity: '100%' },
  [FrontendModuleState.PLAN_CAN_TAKE]: { color: 'gray', opacity: '100%' },
  [FrontendModuleState.SUGGESTED]: {
    color: 'gray',
    opacity: '50%',
    border: 'dashed',
  },
}

export function getModuleStates(
  modules: ModuleSources,
  canTake: CanTakeModuleMap
): ModuleStateDict {
  // Get required data
  const { done, doing, planned } = modules

  // Create states
  // Assume that all modules are planned at first.
  // If any modules are done/doing, they get updated later.
  const states: ModuleStateDict = {}
  planned.forEach((code) => {
    states[code] = canTake[code]
      ? FrontendModuleState.PLAN_CAN_TAKE
      : FrontendModuleState.PLAN_CANNOT_TAKE
  })
  done.forEach((code) => {
    states[code] = FrontendModuleState.DONE
  })
  doing.forEach((code) => {
    states[code] = FrontendModuleState.DOING
  })

  return states
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
  canTake: CanTakeModuleMap
) {
  const modules: ModuleSources = {
    done,
    doing,
    // get LATEST modules done and doing
    planned: nodes
      .map((n) => n.id)
      .filter((m) => !done.includes(m) && !doing.includes(m)),
  }

  const states = getModuleStates(modules, canTake)

  return nodes.map((node) => ({
    ...node,
    style: cssMap[states[node.id]],
  }))
}
