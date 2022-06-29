import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { SelectedModules } from '../modules/selected-modules'
import { setBuildList } from '@/store/search'
import { api } from '@/utils/api'

export function Edit(props: { setPage: SetState<Pages['Degrees']> }) {
  const { buildList, buildTitle, buildId } = useAppSelector(
    (state) => state.search
  )
  const state = {
    title: useState<string>(buildTitle),
  }
  const dispatch = useAppDispatch()
  useEffect(() => {
    api.degree
      .getById(buildId)
      .then((degree) => degree.modules)
      .then((moduleCodes) => api.moduleCondensed.getByCodes(moduleCodes))
      .then((modules) => {
        dispatch(setBuildList(modules))
      })
  }, [])
  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Edit"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input className="w-full mb-4" state={state.title} grayed />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <SettingsSearchBox />
          <Button>Add Module</Button>
        </div>
        <SelectedModules modules={buildList} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green">Save degree</Button>
      </div>
    </div>
  )
}
