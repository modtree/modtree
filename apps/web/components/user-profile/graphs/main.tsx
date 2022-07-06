import { Button } from '@/ui/buttons'
import { Input } from '@/ui/html'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAppSelector } from '@/store/redux'
import { getUniqueGraphTitle } from '@/utils/graph'
import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { Row } from '@/ui/settings/lists/rows'
import { GraphIcon } from '@/ui/icons'
import { EmptyBox } from '@/ui/settings/empty-box'
import { Degree, Graph } from '@modtree/types'
import { lowercaseAndDash } from '@/utils/string'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Graphs']>>
}) {
  const graphs = useAppSelector((state) => state.user.savedGraphs)
  const hasGraphs = graphs.length !== 0

  const degrees = useAppSelector((state) => state.user.savedDegrees)
  const hasDegrees = degrees.length !== 0

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
      <SettingsSection title="Graphs" addButtonText={hasGraphs && 'New graph'}>
        {hasGraphs ? (
          <>
            <p>{text.graphListSection.summary}</p>
            <GraphSection degrees={degrees} graphs={graphs} />
          </>
        ) : (
          <EmptyBox
            summary={text.graphListSection.emptySummary}
            buttonText="New graph"
          />
        )}
      </SettingsSection>
    </>
  )
}

function GraphSection(props: { degrees: Degree[]; graphs: Graph[] }) {
  const { degrees, graphs } = props
  return (
    <div className="ui-rectangle flex flex-col overflow-hidden">
      <Row.Header>
        <GraphIcon className="mr-2" />
        Graphs
      </Row.Header>
      {degrees.map((d) => {
        const thisGraphs = graphs.filter((g) => g.degree.id === d.id)
        return (
          <>
            <Row.Header>{lowercaseAndDash(d.title)}</Row.Header>
            {thisGraphs.length !== 0 ? (
              <>
                {thisGraphs.map((g) => {
                  return (
                    <Row.Graph key={getUniqueGraphTitle(g)}>
                      {getUniqueGraphTitle(g)}
                    </Row.Graph>
                  )
                })}
              </>
            ) : (
              <Row.Empty>This degree has no graphs.</Row.Empty>
            )}
          </>
        )
      })}
    </div>
  )
}
