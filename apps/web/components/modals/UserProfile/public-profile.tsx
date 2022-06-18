import { useUser } from '@/utils/auth0'
import { useState } from 'react'
import { H2, H3, H4, Input } from '@/components/html'
import { Button } from '@/components/buttons'

export default function PublicProfile() {
  const { user } = useUser()
  const state = {
    name: useState<string>(user.nickname),
  }
  return (
    <div>
      <H2 underline>Public profile</H2>
      <H3>Name</H3>
      <H4>Name</H4>
      <Input className="w-full mb-4" state={state.name} />
      <Button>Update profile</Button>
      <Button color="red">Transfer</Button>
      <Button color="green">Set up sponsor button</Button>
    </div>
  )
}
