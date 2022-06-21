import { GraphIcon } from '@/ui/icons'
import { dashed } from '@/utils/array'
import { DegreeGraphs } from 'types'
import { SettingsSection } from './base'
import { EmptyBox } from '@/ui/settings/empty-box'
import { Row } from './rows'

export function GraphListSection(props: {
  contents: DegreeGraphs[]
  title: string
  summary?: string
}) {
  const hasGraphs = props.contents.length !== 0
  const { title, contents, summary } = props
  return (
    <div className="mb-12">
      <SettingsSection title={title} addButtonText={hasGraphs && 'New graph'}>
        {hasGraphs ? (
          <>
            {summary && <p>{summary}</p>}
            <div className="ui-rectangle flex flex-col overflow-hidden">
              <Row.GraphHeader>
                <GraphIcon className="mr-2" />
                Graphs
              </Row.GraphHeader>
              {contents.map(({ degree, graphs }, index) => (
                <>
                  <Row.GraphHeader key={dashed(degree, index)}>
                    {degree}
                  </Row.GraphHeader>
                  {graphs.map((graph, index) => (
                    <Row.Graph key={dashed(degree, graph, index)}>
                      {degree}/{graph}
                    </Row.Graph>
                  ))}
                </>
              ))}
            </div>
          </>
        ) : (
          <EmptyBox
            summary="There are no graphs for this user"
            buttonText="New graph"
          />
        )}
      </SettingsSection>
    </div>
  )
}
