import { useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'

export function PublicProfileTabContent() {
  const state = {
    name: useState<string>('cool_username' || ''),
    faculty: useState<string>('best_faculty'),
    bio: useState<string>(''),
  }
  return (
    <>
      <h2>Public profile</h2>
      <h6>Name</h6>
      <Input className="w-full mb-4" state={state.name} grayed />
      <h6>Faculty</h6>
      <Input className="w-full mb-4" state={state.faculty} grayed />
      <h6>Bio</h6>
      <Input className="w-full mb-4" state={state.bio} grayed />
      <Button color="green">Update profile</Button>
    </>
  )
}
