import { Dispatch, SetStateAction } from 'react'

export type UseState<Type> = [Type, Dispatch<SetStateAction<Type>>]
