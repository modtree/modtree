import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { ModtreeApiResponse, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { SelectedModules } from '../modules/selected-modules'
import { backend } from '@/utils/backend'
import { setBuildList } from '@/store/search'

export function Edit(props: { setPage: SetState<Pages['Degrees']> }) {
  const { buildList, buildTitle, buildId } = useAppSelector(
    (state) => state.search
  )
  const state = {
    title: useState<string>(buildTitle),
  }
  const dispatch = useAppDispatch()
  useEffect(() => {
    const degree = backend
      .get<ModtreeApiResponse.Degree>(`/degree/${buildId}`)
      .then((res) => res.data)
    degree
      .then((degree) => {
        console.log('fetched degree', degree)
        return degree.modules
      })
      .then((moduleCodes) =>
        backend.get(`/modules-condensed`, { params: { moduleCodes } })
      )
      .then((res) => {
        dispatch(setBuildList(res.data))
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
