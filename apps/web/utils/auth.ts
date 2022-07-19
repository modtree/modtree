import { useSession as nextAuthUseSession } from 'next-auth/react'

export function useSession() {
  const { data, status } = nextAuthUseSession()
  return { status, user: data?.user }
}
