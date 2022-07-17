import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAppSelector } from '@/store/redux'
import { getUniqueGraphTitle } from '@/utils/graph'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { Row } from '@/ui/settings/lists/rows'
import { GraphIcon } from '@/ui/icons'
import { EmptyBox } from '@/ui/settings/empty-box'
import { ModtreeApiResponse } from '@modtree/types'
import { lowercaseAndDash } from '@/utils/string'
import { Pages } from 'types'
import { GraphPicker } from '@/ui/search/graph/graph-picker'
import { trpc } from '@/utils/trpc'
import { useUser } from '@/utils/auth0'
import { updateUser } from '@/utils/rehydrate'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Graphs']>>
}) {
  // Get IDs
  const graphIds = useAppSelector((state) => state.user.savedGraphs)
  const degreeIds = useAppSelector((state) => state.user.savedDegrees)
  const hasGraphs = graphIds.length !== 0

  // Load full degrees
  const [degrees, setDegrees] = useState<ModtreeApiResponse.Degree[]>([])
  useEffect(() => {
    trpc.query('degrees', degreeIds).then((degrees) => {
      setDegrees(degrees)
    })
  }, [degreeIds])

  // Load graphs
  const [graphs, setGraphs] = useState<ModtreeApiResponse.Graph[]>([])
  // placeholder state
  // updated correctly in useEffect
  const mainGraph = useAppSelector((state) => state.graph)
  const state = {
    graph: useState<ModtreeApiResponse.Graph>(mainGraph),
  }

  useEffect(() => {
    trpc.query('graphs', graphIds).then((graphs) => {
      setGraphs(graphs)
      // mainGraph is different from graphs
      // mainGraph has an extra property selectedCodes
      // removing that property is still not enough for React to check equality
      const graph = graphs.find((g) => g.id === mainGraph.id)
      if (graph) state.graph[1](graph)
    })
  }, [graphIds])

  return (
    <>
      <h2>Default graph</h2>
      <p className="mb-4">Choose the default graph to display.</p>
      <div className="flex flex-row space-x-2 mb-4">
        <GraphPicker graphs={graphs} select={state.graph} />
      </div>
      <SettingsSection
        title="Graphs"
        addButtonText={hasGraphs ? 'New graph' : ''}
        onAddClick={() => props.setPage('add-new')}
      >
        {hasGraphs ? (
          <>
            <p>{text.graphListSection.summary}</p>
            <GraphSection
              degrees={degrees}
              graphs={graphs}
              mainGraph={mainGraph}
            />
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

function GraphSection(props: {
  degrees: ModtreeApiResponse.Degree[]
  graphs: ModtreeApiResponse.Graph[]
  mainGraph: ModtreeApiResponse.Graph
}) {
  const { degrees, graphs } = props

  const { user } = useUser()

  async function removeGraph(graphId: string) {
    const userId = user?.modtreeId
    if (userId) {
      trpc
        .mutation('user/remove-graph', {
          userId,
          graphId,
        })
        .then(() => updateUser())
    }
  }

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
                {thisGraphs.map((g) =>
                  /**
                   * Do not allow remove, if the graph is the main graph
                   */
                  props.mainGraph.id === g.id ? (
                    <Row.Graph key={g.id}>{getUniqueGraphTitle(g)}</Row.Graph>
                  ) : (
                    <Row.Graph
                      key={g.id}
                      deletable
                      onDelete={() => removeGraph(g.id)}
                    >
                      {getUniqueGraphTitle(g)}
                    </Row.Graph>
                  )
                )}
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
