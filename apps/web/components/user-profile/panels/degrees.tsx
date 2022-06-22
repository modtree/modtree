import { DegreeSummary } from 'types'
import { text } from './text'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Row } from '@/ui/settings/lists/rows'
import { dashed } from '@/utils/array'
import { Slash } from '@/components/inline'
import { Dispatch, SetStateAction, useState } from 'react'

type Page = 'main' | 'add-new'

const degreeContent: DegreeSummary[] = [
  { title: 'computer-science', graphCount: 4 },
  { title: 'mathematics', graphCount: 420 },
]

function Main(props: { setPage: Dispatch<SetStateAction<Page>> }) {
  const hasDegree = degreeContent.length !== 0
  return (
    <div className="mb-12">
      <SettingsSection
        title="Degrees"
        addButtonText="Add degree"
        onAddClick={() => props.setPage('add-new')}
      >
        {hasDegree ? (
          <>
            <p>{text.degreeListSection.summary}</p>
            <div className="ui-rectangle flex flex-col overflow-hidden">
              {degreeContent.map((degree, index) => (
                <Row.Degree key={dashed(degree.title, index)}>
                  <b>{degree.title}</b>
                  <Slash />
                  {degree.graphCount} graphs
                </Row.Degree>
              ))}
            </div>
          </>
        ) : (
          <p>{text.degreeListSection.emptySummary}</p>
        )}
      </SettingsSection>
    </div>
  )
}

function AddNew(props: { setPage: Dispatch<SetStateAction<Page>> }) {
  return (
    <div className="mb-12">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Add new"
        addButtonText="Add degree"
      >
        <p>what's up</p>
      </SettingsSection>
    </div>
  )
}

export function DegreesTabContent() {
  const [page, setPage] = useState<Page>('main')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-new') {
    return <AddNew setPage={setPage} />
  }
}
