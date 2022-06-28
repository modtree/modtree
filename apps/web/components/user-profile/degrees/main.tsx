import { DegreeSummary, Pages } from 'types'
import { text } from 'text'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Row } from '@/ui/settings/lists/rows'
import { dashed } from '@/utils/array'
import { Dispatch, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList, setBuildId, setBuildTitle } from '@/store/search'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
  content: DegreeSummary[]
}) {
  const hasDegree = props.content.length !== 0
  const dispatch = useAppDispatch()
  const degreeIds = useAppSelector((state) => state.user.savedDegrees)
  const degreeCache = useAppSelector((state) => state.cache.degrees)
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
              {degreeIds.map((degreeId, index) => {
                const degree = degreeCache[degreeId]
                return (
                  <Row.Degree
                    key={dashed(degree.title, index)}
                    onEdit={() => {
                      dispatch(clearBuildList())
                      dispatch(setBuildTitle(degree.title))
                      dispatch(setBuildId(degree.id))
                      props.setPage('edit')
                    }}
                  >
                    <b>{degree.title}</b>
                  </Row.Degree>
                )
              })}
            </div>
          </>
        ) : (
          <p>{text.degreeListSection.emptySummary}</p>
        )}
      </SettingsSection>
    </div>
  )
}
