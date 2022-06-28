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
