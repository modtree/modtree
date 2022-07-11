import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { IDegree, InitGraphProps, SetState } from '@modtree/types'
import { Pages } from 'types'
import { DegreePicker } from '@/ui/search/degree/degree-picker'
import { useAppSelector } from '@/store/redux'
import { flatten } from '@modtree/utils'
import { useUser } from '@/utils/auth0'
import { api } from 'api'
import { updateUser } from '@/utils/rehydrate'

export function AddNew(props: { setPage: SetState<Pages['Graphs']> }) {
  const degrees = useAppSelector((state) => state.user.savedDegrees)
  const modulesDone = useAppSelector((state) => state.user.modulesDone)
  const modulesDoing = useAppSelector((state) => state.user.modulesDoing)

  const modulesDoneCodes = modulesDone.map(flatten.module)
  const modulesDoingCodes = modulesDoing.map(flatten.module)

  const { user } = useUser()

  const state = {
    title: useState<string>(''),
    degree: useState<IDegree>(degrees[0]),
  }

  async function saveGraph() {
    const graphProps: InitGraphProps = {
      title: state.title[0],
      userId: user.modtreeId,
      degreeId: state.degree[0].id,
    }
    // frontend validation
    if (graphProps.title === '') {
      alert('Graph title should not be empty')
      return
    }
    // send request
    api.graph
      .create(graphProps)
      .then((graph) => api.user.insertGraph(user.modtreeId, graph.id))
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
        <h6>Modules</h6>
        <Modules
          modulesDoneCodes={modulesDoneCodes}
          modulesDoingCodes={modulesDoingCodes}
        />
        <h6>Degree</h6>
        <DegreePicker
          degrees={degrees}
          select={state.degree}
          modulesDoneCodes={modulesDoneCodes}
          modulesDoingCodes={modulesDoingCodes}
        />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={saveGraph}>
          Save graph
        </Button>
      </div>
    </div>
  )
}

function Modules(props: {
  modulesDoneCodes: string[]
  modulesDoingCodes: string[]
}) {
  return (
    <div className="mb-4">
      <div className="bg-gray-200 p-2 rounded-xl flex-col space-y-2">
        <p>The following modules will be placed in the graph:</p>
        <p className="mb-0">
          <b>Done:</b> {props.modulesDoneCodes.join(', ')}
        </p>
        <p className="mb-0">
          <b>Doing:</b> {props.modulesDoingCodes.join(', ')}
        </p>
      </div>
    </div>
  )
}
