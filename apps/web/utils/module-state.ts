import {
  ModuleStateDict,
  FrontendModuleState,
  GraphFlowNode,
  CanTakeModuleMap,
  ModuleSources,
} from '@modtree/types'

export async function getModuleStates(
  modules: ModuleSources,
  canTake: CanTakeModuleMap
): Promise<ModuleStateDict> {
  // Get required data
  const { done, doing, planned } = modules

  // Create states
  // Assume that all modules are planned at first.
  // If any modules are done/doing, they get updated later.
  let states: ModuleStateDict = {}
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
export async function getCSS(
  nodes: GraphFlowNode[],
  done: string[],
  doing: string[],
  canTake: CanTakeModuleMap
) {
  // get LATEST modules done and doing
  const modulesPlaced = nodes.map((n) => n.id)

  const modules: ModuleSources = {
    done,
    doing,
    planned: modulesPlaced.filter(
      (m) => !done.includes(m) && !doing.includes(m)
    ),
  }

  const states = await getModuleStates(modules, canTake)

  return nodes.map((node) => ({
    ...node,
    style: cssMap[states[node.id]],
  }))
}

const cssMap = {}
cssMap[FrontendModuleState.DONE] = {
  color: 'green',
  opacity: '50%',
}
cssMap[FrontendModuleState.DOING] = {
  color: 'black',
  opacity: '100%',
}
cssMap[FrontendModuleState.PLAN_CANNOT_TAKE] = {
  color: 'red',
  opacity: '100%',
}
cssMap[FrontendModuleState.PLAN_CAN_TAKE] = {
  color: 'gray',
  opacity: '100%',
}
cssMap[FrontendModuleState.SUGGESTED] = {
  color: 'gray',
  opacity: '50%',
  border: 'dashed',
}
