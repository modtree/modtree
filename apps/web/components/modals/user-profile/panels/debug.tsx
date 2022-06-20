import { useState } from 'react'
import { Input } from '@/components/html'
import { AddButton, Button } from '@/ui/buttons'

export function DebugTabContent() {
  const state = {
    markdownTest: useState('input field'),
  }
  return (
    <div>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <h1>Heading 1 underlined</h1>
      <h2>Heading 2 underlined</h2>
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