import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppSelector } from '@/store/redux'
import { SelectedModules } from '../modules/selected-modules'
import { api } from 'api'

export function Edit(props: { setPage: SetState<Pages['Degrees']> }) {
  const { buildList, buildTitle, buildId } = useAppSelector(
    (state) => state.search
  )
  const state = { title: useState<string>(buildTitle) }

  /* set build list */
  useEffect(() => {
    api.degree.setBuildTarget(buildId)
  }, [])

  const update = async (title: string, moduleCodes: string[]) =>
    api.degree
      .update(buildId, title, moduleCodes)
      .then(() => props.setPage('main'))

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Edit"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input
          className="w-full mb-4"
          state={state.title}
          grayed
          cypress="edit-degree-title"
        />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <SettingsSearchBox />
        </div>
        <SelectedModules modules={buildList} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={() => update(state.title[0], buildList)}>
          Save degree
        </Button>
      </div>
    </div>
  )
}
