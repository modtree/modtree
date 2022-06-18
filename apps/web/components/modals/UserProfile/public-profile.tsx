import { useUser } from '@/utils/auth0'
import { useState } from 'react'
import { H1, H3, Input } from './html'
import { Button } from '@/components/buttons'

export default function PublicProfile() {
  const { user } = useUser()
  const state = {
    name: useState<string>(user.nickname),
  }
  return (
    <div>
      <H1 underline>Public profile</H1>
      <H3>Name</H3>
      <Input className="w-full mb-4" state={state.name} />
      <Button>Update profile</Button>
      <Button color="red">Transfer</Button>
      <Button color="green">Set up sponsor button</Button>
    </div>
  )
}
