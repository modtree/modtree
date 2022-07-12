import {
  ModuleStateDict,
  FrontendModuleState,
  GraphFlowNode,
  GraphFlowEdge,
} from '@modtree/types'
import { redrawGraph as redraw } from '@modtree/utils'

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

type Props = {
  done: string[]
  doing: string[]
  planned: string[]
}

export async function getModuleStates(
  props: Props,
  canTake: Record<string, boolean>
): Promise<ModuleStateDict> {
  // Get required data
  const { done, doing, planned } = props

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
  props: Props,
  canTake: Record<string, boolean>
) {
  const states = await getModuleStates(props, canTake)
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
