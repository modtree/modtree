import { useUser } from '@/utils/auth0'
import { useState } from 'react'
import { H1, H3, Input } from './html'

export default function PublicProfile() {
  const { user } = useUser()
  const state = {
    name: useState<string>(user.nickname),
  }
  return (
    <div>
      <H1>Public profile</H1>
      <H3>Name</H3>
      <Input state={state.name} />
      <button>Update profile</button>
    </div>
  )
}
