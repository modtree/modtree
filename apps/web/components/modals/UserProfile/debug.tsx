import { useUser } from '@/utils/auth0'
import { useState } from 'react'
import { H1, H2, H3, H4, H5, H6, Input } from '@/components/html'
import { Button } from '@/components/buttons'

export default function Debug() {
  const { user } = useUser()
  const state = {
    name: useState<string>(user.nickname),
  }
  return (
    <div>
      <H1 underline>Debug</H1>
      <H1 underline>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
      <Input className="w-full mb-4" state={state.name} />
      <Button>Update profile</Button>
      <Button color="red">Transfer</Button>
      <Button color="green">Set up sponsor button</Button>
    </div>
  )
}
