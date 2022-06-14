import { Dispatch, SetStateAction } from 'react'

export type SetState<Type> = Dispatch<SetStateAction<Type>>
export type UseState<Type> = [Type, SetState<Type>]

export type FlowNodeCondensed = {
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
