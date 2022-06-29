import { GraphIcon } from '@/ui/icons'
import { dashed } from '@/utils/array'
import { DegreeGraphs } from 'types'
import { SettingsSection } from './base'
import { EmptyBox } from '@/ui/settings/empty-box'
import { Row } from './rows'
import { Fragment } from 'react'

export function GraphListSection(props: {
  contents: DegreeGraphs[]
  title: string
  summary?: string
}) {
  const hasGraphs = props.contents.length !== 0
  const { title, contents, summary } = props
  return (
    <div>
      <SettingsSection title={title} addButtonText={hasGraphs && 'New graph'}>
        {hasGraphs ? (
          <>
            {summary && <p>{summary}</p>}
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
            summary="There are no graphs for this user"
            buttonText="New graph"
          />
        )}
      </SettingsSection>
    </div>
  )
}
