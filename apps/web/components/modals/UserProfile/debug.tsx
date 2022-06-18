import { useUser } from '@/utils/auth0'
import { useState } from 'react'
import { H1, H2, H3, H4, H5, H6, Input } from './html'
import { Button } from '@/components/buttons'

export default function Debug() {
  const { user } = useUser()
  const state = {
    name: useState<string>(user.nickname),
  }
  return (
    <div>
      <H1 underline>Public profile</H1>
      <H2>Public profile</H2>
      <H3>Public profile</H3>
      <H4>Public profile</H4>
      <H5>Public profile</H5>
      <H6>Public profile</H6>
      <Input className="w-full mb-4" state={state.name} />
      <Button>Update profile</Button>
      <Button color="red">Transfer</Button>
      <Button color="green">Set up sponsor button</Button>
    </div>
  )
}
