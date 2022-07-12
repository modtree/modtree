import { ModuleStatus } from './repository'

export type FlowNodeCondensed = {
  title: string
  moduleCode: string
  position: {
    x: number
    y: number
  }
}

export type FlowEdgeCondensed = {
  id: string
  source: string
  target: string
}

/**
 * For module styling
 */
export type ModuleState = {
  done: ModuleStatus
  canTake?: boolean
  suggested?: boolean
}

export type ModuleStateDict = Record<string, ModuleState>
