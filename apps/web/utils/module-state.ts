import store from '@/store/redux'
import {
  ModuleStateDict,
  FrontendModuleState,
  GraphFlowNode,
  GraphFlowEdge,
} from '@modtree/types'
import { flatten, redrawGraph as redraw } from '@modtree/utils'

type NodesAndEdges = {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
}

/**
 * Wrapper for the function in libs/utils
 */
export function redrawGraph(props: NodesAndEdges) {
  const data: NodesAndEdges = redraw(props)
  return {
    nodes: data.nodes,
    edges: data.edges,
  }
}

export function getModuleStates(): ModuleStateDict {
  // Get required data
  const redux = store.getState()
  const done = redux.user.modulesDone.map(flatten.module)
  const doing = redux.user.modulesDone.map(flatten.module)
  const planned = redux.graph.modulesPlaced.filter(
    (m) => !done.includes(m) && !doing.includes(m)
  )

  // Create states
  let states: ModuleStateDict = {}
  done.forEach((code) => {
    states[code] = ModuleState.DONE
  })
  doing.forEach((code) => {
    states[code] = ModuleState.DOING
  })
  planned.forEach((code) => {
    states[code] = ModuleState.PLAN_CAN_TAKE
  })

  return states
}
