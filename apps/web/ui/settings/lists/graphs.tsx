import { GraphIcon } from '@/ui/icons'
import { dashed } from '@/utils/array'
import { DegreeGraphs } from 'types'
import { SettingsSection } from './base'
import { EmptyBox } from '@/ui/settings/empty-box'
import { Row } from './rows'
import { Fragment } from 'react'
import { text } from 'text'

export function GraphListSection(props: {
  contents: DegreeGraphs[]
  title: string
}) {
  const hasGraphs = props.contents.length !== 0
  const { title, contents } = props
  return (
    <div>
      <SettingsSection
        title={title}
        addButtonText={hasGraphs ? 'New graph' : ''}
      >
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
    </div>
  )
}
