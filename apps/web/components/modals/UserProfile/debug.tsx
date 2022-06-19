import { useState } from 'react'
import { H1, H2, H3, H4, H5, H6, Input } from '@/components/html'
import { AddButton, Button } from '@/components/buttons'
import { ExtendedProps } from '@/types'

export default function Debug() {
  const state = {
    markdownTest: useState('input field'),
  }
  return (
    <div>
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
      <H1 underline>Heading 1 underlined</H1>
      <H2 underline>Heading 2 underlined</H2>
      <Input className="w-full mb-4" state={state.markdownTest} />
      <div className="flex flex-row space-x-4">
        <Button>Update profile</Button>
        <Button color="red">Delete user</Button>
        <Button color="green">Upgrade</Button>
        <AddButton />
      </div>
    </div>
  )
}
