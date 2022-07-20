import { Dispatch, SetStateAction, Fragment } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { getUniqueGraphTitle } from '@/utils/graph'
import { SettingsSection, Row, EmptyBox } from '@/ui/settings'
import { text } from 'text'
import { GraphIcon } from '@/ui/icons'
import { ApiResponse } from '@modtree/types'
import { lowercaseAndDash } from '@/utils/string'
import { Pages } from 'types'
import { GraphPicker } from '@/ui/search/graph/graph-picker'
import { trpcReact } from '@/utils/trpc'
import { setBuildId, setBuildTitle, setDegreeTitle } from '@/store/search'
import { dashed } from '@/utils/array'
import { removeGraph } from '@/store/modtree-functions'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Graphs']>>
}) {
  /** hooks */
  const { user, graph } = useAppSelector((s) => s.modtree)
  const { data: degrees } = trpcReact.useQuery(['degrees', user.savedDegrees], {
    keepPreviousData: true,
  })
  const { data: graphs } = trpcReact.useQuery(['graphs', user.savedGraphs], {
    keepPreviousData: true,
  })

  return (
    <>
      <h2>Default graph</h2>
      <p className="mb-4">Choose the default graph to display.</p>
      <div className="flex flex-row space-x-2 mb-4">
        <div className="ui-rectangle shadow-none h-8 w-64">
          <GraphPicker />
        </div>
      </div>
      <SettingsSection
        title="Graphs"
        addButtonText={user.savedGraphs.length > 0 ? 'New graph' : ''}
        onAddClick={() => props.setPage('add-new')}
      >
        {user.savedGraphs.length > 0 ? (
          <>
            <p>{text.graphListSection.summary}</p>
            <GraphSection
              degrees={degrees || []}
              graphs={graphs || []}
              mainGraph={graph}
              userId={user.id}
              setPage={props.setPage}
            />
          </>
        ) : (
          <EmptyBox
            summary={text.graphListSection.emptySummary}
            buttonText="New graph"
            onClick={() => props.setPage('add-new')}
          />
        )}
      </SettingsSection>
    </>
  )
}

function GraphSection(props: {
  degrees: ApiResponse.Degree[]
  graphs: ApiResponse.Graph[]
  mainGraph: ApiResponse.Graph
  userId: string
  setPage: Dispatch<SetStateAction<Pages['Graphs']>>
}) {
  const { degrees, graphs } = props
  const dispatch = useAppDispatch()

  return (
    <div className="ui-rectangle flex flex-col overflow-hidden">
      <Row.Header>
        <GraphIcon className="mr-2" />
        Graphs
      </Row.Header>
      {degrees.map((d, i) => {
        const thisGraphs = graphs.filter((g) => g.degree.id === d.id)
        return (
          <Fragment key={dashed(d.id, i)}>
            <Row.Header>{lowercaseAndDash(d.title)}</Row.Header>
            {thisGraphs.length !== 0 ? (
              <>
                {thisGraphs.map((g) =>
                  /**
                   * Do not allow remove, if the graph is the main graph
                   */
                  props.mainGraph.id === g.id ? (
                    <Row.Graph
                      key={g.id}
                      onEdit={() => {
                        dispatch(setBuildTitle(g.title))
                        dispatch(setBuildId(g.id))
                        dispatch(setDegreeTitle(g.degree.title))
                        props.setPage('edit')
                      }}
                    >
                      {getUniqueGraphTitle(g)}
                    </Row.Graph>
                  ) : (
                    <Row.Graph
                      key={g.id}
                      deletable
                      onDelete={() => removeGraph(g.id)}
                      onEdit={() => {
                        dispatch(setBuildTitle(g.title))
                        dispatch(setBuildId(g.id))
                        dispatch(setDegreeTitle(g.degree.title))
                        props.setPage('edit')
                      }}
                    >
                      {getUniqueGraphTitle(g)}
                    </Row.Graph>
                  )
                )}
              </>
            ) : (
              <Row.Empty>This degree has no graphs.</Row.Empty>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
