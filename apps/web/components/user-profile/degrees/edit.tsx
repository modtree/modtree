import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { IModule, InitDegreeProps, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { SelectedModules } from '../modules/selected-modules'
import { setBuildList } from '@/store/search'
import { api } from 'api'
import { useUser } from '@/utils/auth0'
import { setUser } from '@/store/user'
import { flatten } from '@modtree/utils'

export function Edit(props: { setPage: SetState<Pages['Degrees']> }) {
  const { user } = useUser()
  const { buildList, buildTitle, buildId } = useAppSelector(
    (state) => state.search
  )
  const state = {
    title: useState<string>(buildTitle),
  }
  const dispatch = useAppDispatch()
  /* set build list */
  useEffect(() => {
    api.degree
      .getById(buildId)
      .then((degree) => degree.modules)
      .then((modules) => {
        dispatch(setBuildList(modules))
      })
  }, [])

  async function modify(title: string, modules: IModule[]) {
    const degreeProps: InitDegreeProps = {
      title,
      moduleCodes: modules.map(flatten.module),
    }
    api.degree
      .modify(buildId, degreeProps)
      .then((degree) => {})
      .then(() => api.user.getById(user.modtreeId))
      .then((user) => dispatch(setUser(user)))
      .then(() => props.setPage('main'))
  }

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
        <Button color="green" onClick={() => modify(state.title[0], buildList)}>
          Save degree
        </Button>
      </div>
    </div>
  )
}
