import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { InitGraphProps, ModtreeApiResponse, SetState } from '@modtree/types'
import { Pages } from 'types'
import { DegreePicker } from '@/ui/search/degree/degree-picker'
import { useAppSelector } from '@/store/redux'
import { useUser } from '@/utils/auth0'
import { updateUser } from '@/utils/rehydrate'
import { trpc } from '@/utils/trpc'

export function AddNew(props: { setPage: SetState<Pages['Graphs']> }) {
  // Get IDs
  const degreeIds = useAppSelector((state) => state.user.savedDegrees)

  // Load full degrees
  const [degrees, setDegrees] = useState<ModtreeApiResponse.Degree[]>([])
  const [loaded, setLoaded] = useState<boolean>(false)
  useEffect(() => {
    trpc.query('degrees', degreeIds).then((degrees) => {
      setDegrees(degrees)
      // actually set the degree
      state.degree[1](degrees[0])
      setLoaded(true)
    })
  }, [degreeIds])

  const { user } = useUser()

  const state = {
    title: useState<string>(''),
    // actually undefined here
    degree: useState<ModtreeApiResponse.Degree>(degrees[0]),
  }

  async function saveGraph() {
    const userId = user?.modtreeId
    if (!userId) return
    const degreeId = state.degree[0].id
    if (!degreeId) return
    const graphProps: InitGraphProps = {
      title: state.title[0],
      userId,
      degreeId,
    }
    // frontend validation
    if (graphProps.title === '') {
      alert('Graph title should not be empty')
      return
    }
    // send request
    trpc
      .mutation('graph/create', graphProps)
      .then((graph) =>
        trpc.mutation('user/insert-graphs', {
          userId,
          graphIds: [graph.id],
        })
      )
      .then(() => updateUser())
      .then(() => props.setPage('main'))
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Graphs"
        onBack={() => props.setPage('main')}
        title="Add new"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input className="w-full mb-4" state={state.title} grayed />
        <h6>Degree</h6>
        {loaded ? (
          <DegreePicker degrees={degrees} select={state.degree} />
        ) : (
          <></>
        )}
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={saveGraph}>
          Save graph
        </Button>
      </div>
    </div>
  )
}
