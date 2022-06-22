import { DegreeSummary } from 'types'
import { DegreeListSection } from '@/ui/settings/lists'
import { text } from './text'

const degreeContent: DegreeSummary[] = [
  { title: 'computer-science', graphCount: 4 },
  { title: 'mathematics', graphCount: 420 },
]

export function DegreesTabContent() {
  return (
    <div className="mb-12">
      <DegreeListSection
        title="Degrees"
        addButtonText="Add degree"
        contents={degreeContent}
        summary={text.degreeListSection.summary}
        emptySummary={text.degreeListSection.emptySummary}
      />
    </div>
  )
}
