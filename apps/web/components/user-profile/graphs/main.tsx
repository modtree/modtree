import { Dispatch, SetStateAction, useState } from 'react'
import { useAppSelector } from '@/store/redux'
import { getUniqueGraphTitle } from '@/utils/graph'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { Row } from '@/ui/settings/lists/rows'
import { GraphIcon } from '@/ui/icons'
import { EmptyBox } from '@/ui/settings/empty-box'
import { IDegree, IGraph } from '@modtree/types'
import { lowercaseAndDash } from '@/utils/string'
import { Pages } from 'types'
import { PickOne } from '@/ui/search/graph/pick-one'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Graphs']>>
}) {
  const graphs = useAppSelector((state) => state.user.savedGraphs)
  const hasGraphs = graphs.length !== 0

  const degrees = useAppSelector((state) => state.user.savedDegrees)

  const mainGraph = useAppSelector((state) => state.user.mainGraph)

  const state = {
    graph: useState<IGraph>(mainGraph),
  }
  return (
    <>
      <h2>Default graph</h2>
      <p className="mb-4">Choose the default graph to display.</p>
      <div className="flex flex-row space-x-2 mb-4">
        <PickOne graphs={graphs} select={state.graph} />
      </div>
      <SettingsSection
        title="Graphs"
        addButtonText={hasGraphs && 'New graph'}
        onAddClick={() => props.setPage('add-new')}
      >
        {hasGraphs ? (
          <>
            <p>{text.graphListSection.summary}</p>
            <GraphSection degrees={degrees} graphs={graphs} />
          </>
        ) : (
          // TODO this button should also link to add-new
          <EmptyBox
            summary={text.graphListSection.emptySummary}
            buttonText="New graph"
          />
        )}
      </SettingsSection>
    </>
  )
}

function GraphSection(props: { degrees: IDegree[]; graphs: IGraph[] }) {
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
                    <Row.Graph key={g.id}>{getUniqueGraphTitle(g)}</Row.Graph>
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
