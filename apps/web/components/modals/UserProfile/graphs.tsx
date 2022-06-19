import { Button } from '@/components/buttons'
import { H2, Input, P } from '@/components/html'
import { ShareIcon } from '@heroicons/react/outline'
import { useState } from 'react'

const iconSize = '1.3em'

function Graphs() {
  return (
    <div className="ui-rectangle text-sm">
      <table className="p-0 m-0 bg-green-100 px-4 py-3">
        <tr className="font-semibold flex flex-row border">
          <ShareIcon
            style={{ height: iconSize, width: iconSize }}
            className="mr-2"
          />
          Graphs
        </tr>
        <tr>something</tr>
        <tr>something</tr>
        <tr>something</tr>
        <tr>something</tr>
        <tr>something</tr>
        <tr>something</tr>
        <tr>something</tr>
      </table>
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
