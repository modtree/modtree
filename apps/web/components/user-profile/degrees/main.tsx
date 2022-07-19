import { Pages } from 'types'
import { text } from 'text'
import { SettingsSection, Row } from '@/ui/settings'
import { dashed } from '@/utils/array'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList, setBuildId, setBuildTitle } from '@/store/search'
import { useSession } from '@/utils/auth'
import { updateUser } from '@/utils/rehydrate'
import { trpc } from '@/utils/trpc'
import { ModtreeApiResponse } from '@modtree/types'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
}) {
  const dispatch = useAppDispatch()

  // Get IDs
  const degreeIds = useAppSelector((state) => state.user.savedDegrees)
  const hasDegree = degreeIds.length !== 0
  const { user } = useSession()

  // Load full degrees
  const [degrees, setDegrees] = useState<ModtreeApiResponse.Degree[]>([])
  useEffect(() => {
    trpc.query('degrees', degreeIds).then((degrees) => {
      setDegrees(degrees)
    })
  }, [degreeIds])

  async function removeDegree(degreeId: string) {
    const userId = user?.modtreeId
    if (userId) {
      trpc
        .mutation('user/remove-degree', {
          userId,
          degreeId,
        })
        .then(() => updateUser())
    }
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
