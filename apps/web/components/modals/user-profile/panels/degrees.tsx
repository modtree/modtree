import { DegreeSummary } from 'types'
import { DegreeListSection } from '@/ui/settings/lists'

const degreeContent: DegreeSummary[] = [
  { title: 'computer-science', graphCount: 4 },
  { title: 'mathematics', graphCount: 420 },
]

export function DegreesTabContent() {
  const summary =
    'This is a list of degrees. Degrees provide a list of required modules ' +
    'to complete. Module suggestions are affected by the current degree.'
  return (
    <div className="mb-12">
      <DegreeListSection
        title="Degrees"
        addButtonText="Add degree"
        contents={degreeContent}
        summary={summary}
        emptySummary="There are no degrees associated with this account."
      />
      <div className="my-12 text-center">Empty debug ↓</div>
      <DegreeListSection
        title="Degrees"
        addButtonText="Add degree"
        contents={[]}
        summary={summary}
        emptySummary="There are no degrees associated with this account."
      />
    </div>
  )
}
