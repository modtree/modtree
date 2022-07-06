import { Button } from '@/ui/buttons'
import { Input } from '@/ui/html'
import { useState } from 'react'
import { GraphListSection } from '@/ui/settings/lists'
import { useAppSelector } from '@/store/redux'
import { getGraphContent, getUniqueGraphTitle } from '@/utils/graph'

export function GraphsTabContent() {
  const graphs = useAppSelector((state) => state.user.savedGraphs)
  const graphContent = getGraphContent(graphs)
  const original = getUniqueGraphTitle(graphs[0])

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
      <GraphListSection contents={graphContent} title="Graphs" />
    </>
  )
}
