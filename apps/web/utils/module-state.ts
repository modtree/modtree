import store from '@/store/redux'
import { ModuleStatus, ModuleStateDict, GraphFlowNode } from '@modtree/types'
import { flatten } from '@modtree/utils'
import { ModuleState } from '../../../libs/types/src/flow'

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
