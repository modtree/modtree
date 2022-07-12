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
    nodes: getCSS(data.nodes),
    edges: data.edges,
  }
}

export function getModuleStates(): ModuleStateDict {
  // Get required data
  const redux = store.getState()
  const done = redux.user.modulesDone.map(flatten.module)
  const doing = redux.user.modulesDoing.map(flatten.module)
  const planned = redux.graph.modulesPlaced.filter(
    (m) => !done.includes(m) && !doing.includes(m)
  )

  // Create states
  let states: ModuleStateDict = {}
  done.forEach((code) => {
    states[code] = FrontendModuleState.DONE
  })
  doing.forEach((code) => {
    states[code] = FrontendModuleState.DOING
  })
  planned.forEach((code) => {
    states[code] = FrontendModuleState.PLAN_CAN_TAKE
  })

  return states
}

export function getCSS(nodes: GraphFlowNode[]): GraphFlowNode[] {
  const states = getModuleStates()
  return nodes.map((node) => ({
    ...node,
    style: cssMap[states[node.id]],
  }))
}

const cssMap = {}
cssMap[FrontendModuleState.DONE] = {
  color: 'green',
  opacity: '50%',
  border: 'solid',
}
cssMap[FrontendModuleState.DOING] = {
  color: 'black',
  opacity: '100%',
  border: 'solid',
}
cssMap[FrontendModuleState.PLAN_CANNOT_TAKE] = {
  color: 'red',
  opacity: '100%',
  border: 'solid',
}
cssMap[FrontendModuleState.PLAN_CAN_TAKE] = {
  color: 'gray',
  opacity: '100%',
  border: 'solid',
}
cssMap[FrontendModuleState.SUGGESTED] = {
  color: 'gray',
  opacity: '50%',
  border: 'dashed',
}
