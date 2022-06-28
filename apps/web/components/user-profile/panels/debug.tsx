import { useState } from 'react'
import { Input } from '@/ui/html'
import { AddButton, Button } from '@/ui/buttons'
import { DegreeListSection, GraphListSection } from '@/ui/settings'
import { text } from 'text'

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
      <div className="my-12 text-center">Empty debug ↓</div>
      <GraphListSection contents={[]} title="Graphs" />
      <DegreeListSection
        title="Degrees"
        addButtonText="Add degree"
        contents={[]}
        summary={text.degreeListSection.summary}
        emptySummary={text.degreeListSection.emptySummary}
      />
    </div>
  )
}
