import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppSelector } from '@/store/redux'
import { BuildList } from '../build-list'
import { createAndSaveDegree } from '@/store/functions'

export function AddNew(props: { setPage: SetState<Pages['Degrees']> }) {
  /** hooks */
  const [disabled, setDisabled] = useState(false)
  const [title, setTitle] = useState('')
  const buildList = useAppSelector((state) => state.search.buildList)

  async function saveDegree() {
    setDisabled(true)
    props.setPage('main')
    createAndSaveDegree(title, buildList)
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Add new"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input
          className="w-full mb-4"
          state={[title, setTitle]}
          grayed
          cypress="add-degree-title"
        />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <div className="w-64 flex">
            <div className="w-64 fixed">
              <SettingsSearchBox cypress="degree-modules-search" />
            </div>
          </div>
        </div>
        <BuildList
          cypress="degree-modules-list"
          cypressModule="degree-module"
        />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" disabled={disabled} onClick={saveDegree}>
          Save degree
        </Button>
      </div>
    </div>
  )
}
