import { DegreeSummary, Pages } from 'types'
import { text } from 'text'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Row } from '@/ui/settings/lists/rows'
import { dashed } from '@/utils/array'
import { Slash } from '@/ui/inline'
import { Dispatch, SetStateAction } from 'react'
import { useAppDispatch } from '@/store/redux'
import { clearBuildList, setBuildTitle } from '@/store/search'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
  content: DegreeSummary[]
}) {
  const hasDegree = props.content.length !== 0
  const dispatch = useAppDispatch()
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
              {props.content.map((degree, index) => (
                <Row.Degree
                  key={dashed(degree.title, index)}
                  onEdit={() => {
                    dispatch(clearBuildList())
                    dispatch(setBuildTitle(degree.title))
                    props.setPage('edit')
                  }}
                >
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
