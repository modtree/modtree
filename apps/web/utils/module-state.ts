import store from '@/store/redux'
import { ModuleStatus, ModuleStateDict } from '@modtree/types'
import { flatten } from '@modtree/utils'

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
    states[code] = {
      done: ModuleStatus.DONE,
    }
  })
  doing.forEach((code) => {
    states[code] = {
      done: ModuleStatus.DOING,
    }
  })
  planned.forEach((code) => {
    states[code] = {
      done: ModuleStatus.NOT_TAKEN,
      canTake: true,
    }
  })

  return states
}
