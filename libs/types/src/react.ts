import type { Dispatch, SetStateAction } from 'react'

export type SetState<Type> = Dispatch<SetStateAction<Type>>
export type UseState<Type> = [Type, SetState<Type>]
