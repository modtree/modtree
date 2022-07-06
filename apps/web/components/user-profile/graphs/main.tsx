import { Button } from '@/ui/buttons'
import { Input } from '@/ui/html'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { useAppSelector } from '@/store/redux'
import { getGraphContent, getUniqueGraphTitle } from '@/utils/graph'
import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { Row } from '@/ui/settings/lists/rows'
import { GraphIcon } from '@/ui/icons'
import { dashed } from '@/utils/array'
import { EmptyBox } from '@/ui/settings/empty-box'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Graphs']>>
}) {
  const graphs = useAppSelector((state) => state.user.savedGraphs)
  const hasGraphs = graphs.length !== 0
  const contents = getGraphContent(graphs)

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
            <div className="ui-rectangle flex flex-col overflow-hidden">
              <Row.Header>
                <GraphIcon className="mr-2" />
                Graphs
              </Row.Header>
              {contents.map(({ degree, graphs }, index) => (
                <Fragment key={dashed(degree, index)}>
                  <Row.Header>{degree}</Row.Header>
                  {graphs.map((graph, index) => (
                    <Row.Graph key={dashed(degree, graph, index)}>
                      {degree}/{graph}
                    </Row.Graph>
                  ))}
                </Fragment>
              ))}
            </div>
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
