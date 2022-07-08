import { Pages } from 'types'
import { text } from 'text'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Row } from '@/ui/settings/lists/rows'
import { dashed } from '@/utils/array'
import { Dispatch, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList, setBuildId, setBuildTitle } from '@/store/search'
import { useUser } from '@/utils/auth0'
import { api } from 'api'
import { updateUser } from '@/utils/rehydrate'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
}) {
  const dispatch = useAppDispatch()
  const degrees = useAppSelector((state) => state.user.savedDegrees)
  const hasDegree = degrees.length !== 0
  const { user } = useUser()

  async function removeDegree(degreeId: string) {
    api.user.removeDegree(user.modtreeId, degreeId).then(() => updateUser())
  }

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
              {degrees.map((degree, index) => {
                return (
                  <Row.Degree
                    key={dashed(degree.title, index)}
                    deletable
                    onDelete={() => removeDegree(degree.id)}
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
