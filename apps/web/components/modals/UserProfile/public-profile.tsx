import { useUser } from '@/utils/auth0'
import { useState } from 'react'
import { H2, H6, Input } from '@/components/html'
import { Button } from '@/components/buttons'

export default function PublicProfile() {
  const { user } = useUser()
  const state = {
    name: useState<string>(user.nickname),
    faculty: useState<string>('Computing'),
    bio: useState<string>(''),
  }
  return (
    <>
      <H2 underline>Public profile</H2>
      <H6>Name</H6>
      <Input className="w-full mb-4" state={state.name} grayed />
      <H6>Faculty</H6>
      <Input className="w-full mb-4" state={state.faculty} grayed />
      <H6>Bio</H6>
      <Input className="w-full mb-4" state={state.bio} grayed />
      <Button color="green">Update profile</Button>
    </>
  )
}
