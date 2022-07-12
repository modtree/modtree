import {
  ModuleStateDict,
  FrontendModuleState,
  GraphFlowNode,
  GraphFlowEdge,
  CanTakeModuleMap,
  ModuleSources,
} from '@modtree/types'
import { redrawGraph as redraw } from '@modtree/utils'

type NodesAndEdges = {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
}

/**
 * Wrapper for the function in libs/utils
 */
export function redrawGraph(modules: NodesAndEdges) {
  const data: NodesAndEdges = redraw(modules)
  return {
    nodes: data.nodes,
    edges: data.edges,
  }
}

export async function getModuleStates(
  modules: ModuleSources,
  canTake: CanTakeModuleMap
): Promise<ModuleStateDict> {
  // Get required data
  const { done, doing, planned } = modules

  // Create states
  let states: ModuleStateDict = {}
  done.forEach((code) => {
    states[code] = FrontendModuleState.DONE
  })
  doing.forEach((code) => {
    states[code] = FrontendModuleState.DOING
  })
  planned.forEach((code) => {
    states[code] = canTake[code]
      ? FrontendModuleState.PLAN_CAN_TAKE
      : FrontendModuleState.PLAN_CANNOT_TAKE
  })

  return states
}

export async function getCSS(
  nodes: GraphFlowNode[],
  modules: ModuleSources,
  canTake: CanTakeModuleMap
) {
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
