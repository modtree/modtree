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
export enum ModuleState {
  DONE = 'done',
  DOING = 'doing',
  PLAN_CAN_TAKE = 'plan can take',
  PLAN_CANNOT_TAKE = 'plan cannot take',
  SUGGESTED = 'suggested',
}

export type ModuleStateDict = Record<string, ModuleState>
