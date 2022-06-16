import { UserContext } from '@auth0/nextjs-auth0'
import { useContext } from 'react'
import { ModtreeUserContext } from 'types'

export function useUser() {
  return useContext<ModtreeUserContext>(UserContext)
}
