import { Slash } from '@/components/inline'
import { dashed } from '@/utils/array'
import { DegreeSummary } from 'types'
import { SettingsSection } from './base'
import { Row } from './rows'

export function DegreeListSection(props: {
  contents: DegreeSummary[]
  title: string
  summary: string
  emptySummary: string
  addButtonText: string
}) {
  const hasDegree = props.contents.length !== 0
  const { title, contents, summary, emptySummary, addButtonText } = props
  return (
    <div className="mb-12">
      <SettingsSection title={title} addButtonText={addButtonText}>
        {hasDegree ? (
          <>
            <p>{summary}</p>
            <div className="ui-rectangle flex flex-col overflow-hidden">
              {contents.map((degree, index) => (
                <Row.Degree key={dashed(degree.title, index)}>
                  <b>{degree.title}</b>
                  <Slash />
                  {degree.graphCount} graphs
                </Row.Degree>
              ))}
            </div>
          </>
        ) : (
          <p>{emptySummary}</p>
        )}
      </SettingsSection>
    </div>
  )
}
