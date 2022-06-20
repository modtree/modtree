import { Button } from '@/ui/buttons'
import { Input } from '@/components/html'
import { useState } from 'react'
import { GraphsSection } from '@/ui/settings/section/graphs'
import { DegreeGraphs } from 'types'

const graphContent: DegreeGraphs[] = [
  {
    degree: 'computer-science',
    graphs: ['main', 'whack', 'blockchain', 'security'],
  },
  {
    degree: 'mathematics',
    graphs: ['minor', 'sidehustle'],
  },
]

export function GraphsTabContent() {
  const original = 'computer-science/main'
  const state = {
    graphName: useState<string>(original),
  }
  return (
    <>
      <h2>Default graph</h2>
      <p className="mb-4">Choose the default graph to display.</p>
      <div className="flex flex-row space-x-2 mb-4">
        <Input className="w-64 mb-4" state={state.graphName} grayed />
        <Button
          disabled={
            state.graphName[0] === original || state.graphName[0] === ''
          }
        >
          Update
        </Button>
      </div>
      <GraphsSection contents={graphContent} title="Graphs" />
      <div className="my-12 text-center">Empty debug ↓</div>
      <GraphsSection contents={[]} title="Graphs" summary="List of graphs." />
    </>
  )
}
