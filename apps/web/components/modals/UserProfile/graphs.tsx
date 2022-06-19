import { Button } from '@/components/buttons'
import { H2, Input, P } from '@/components/html'
import { useState } from 'react'

function Graphs() {
  return (
    <div className="bg-gray-100 h-96 w-96">
      <div></div>
    </div>
  )
}

export default function GraphTabContent() {
  const original = 'The Plan'
  const state = {
    graphName: useState<string>(original),
  }
  return (
    <>
      <H2 underline>Default graph</H2>
      <P className="mb-4">Choose the default graph to display.</P>
      <div className="flex flex-row space-x-2 mb-4">
        <Input className="w-48 mb-4" state={state.graphName} grayed />
        <Button
          disabled={
            state.graphName[0] === original || state.graphName[0] === ''
          }
        >
          Update
        </Button>
      </div>
      <H2 underline>Graphs</H2>
      <Graphs />
    </>
  )
}
