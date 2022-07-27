import { Button } from '@/ui/buttons'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { ApiResponse, SetState } from '@modtree/types'
import { Pages } from 'types'
import { DegreePicker } from '@/ui/search/degree/degree-picker'
import { SettingsSection } from '@/ui/settings'
import { useAppSelector } from '@/store/redux'
import { createAndSaveGraph } from '@/store/functions'

export function AddNew(props: { setPage: SetState<Pages['Graphs']> }) {
  const { degree: mainDegree } = useAppSelector((s) => s.modtree)
  const [disabled, setDisabled] = useState(false)
  const [title, setTitle] = useState('')
  const [degree, setDegree] = useState<ApiResponse.Degree>(mainDegree)

  async function saveGraph() {
    // frontend validation
    if (title === '') {
      alert('Graph title should not be empty')
      return
    }
    setDisabled(true)
    createAndSaveGraph(title, degree.id)
    props.setPage('main')
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
        <Input
          cypress="add-graph-title"
          className="w-full mb-4"
          state={[title, setTitle]}
          grayed
        />
        <h6>Degree</h6>
        <DegreePicker degreeState={[degree, setDegree]} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" disabled={disabled} onClick={saveGraph}>
          Save graph
        </Button>
      </div>
    </div>
  )
}
