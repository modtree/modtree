import { Pages } from 'types'
import { text } from 'text'
import { SettingsSection, Row } from '@/ui/settings'
import { dashed } from '@/utils/array'
import { Dispatch, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList, setBuildId, setBuildTitle } from '@/store/search'
import { trpcReact } from '@/utils/trpc'
import { removeDegree } from '@/store/modtree-functions'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
}) {
  const dispatch = useAppDispatch()

  // Get IDs
  const degreeIds = useAppSelector((s) => s.modtree.user.savedDegrees)
  const { data: degrees } = trpcReact.useQuery(['degrees', degreeIds])

  return (
    <div className="mb-12">
      <SettingsSection
        title="Degrees"
        addButtonText="Add degree"
        onAddClick={() => props.setPage('add-new')}
        cypress="add-degree-button"
      >
        {degrees ? (
          <>
            <p>{text.degreeListSection.summary}</p>
            <div
              data-cy="degrees-list"
              className="ui-rectangle flex flex-col overflow-hidden"
            >
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
