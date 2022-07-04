import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { Button } from '@/ui/buttons'
import { IModule, IModuleCondensed, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList, removeFromBuildList } from '@/store/search'
import { api } from 'api'
import { useUser } from '@/utils/auth0'
import { setUser } from '@/store/user'

function SelectedModules(props: { modules: IModule[] }) {
  const dispatch = useAppDispatch()
  return (
    <>
      {props.modules.length !== 0 && (
        <div className="ui-rectangle flex flex-col overflow-hidden">
          {props.modules.map((module, index) => (
            <Row.Module
              key={dashed(module.moduleCode, index)}
              deletable
              onDelete={() => dispatch(removeFromBuildList(module))}
            >
              <span className="font-semibold">{module.moduleCode}</span>
              <span className="mx-1">/</span>
              {module.title}
            </Row.Module>
          ))}
        </div>
      )}
    </>
  )
}

export function AddNew(props: { setPage: SetState<Pages['Degrees']> }) {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const state = {
    title: useState<string>(''),
  }

  const buildList = useAppSelector((state) => state.search.buildList)
  useEffect(() => {
    dispatch(clearBuildList())
  }, [])

  async function saveDegree(title: string, modules: IModule[]) {
    api.degree
      .create(title, modules)
      .then((degree) => api.user.insertDegree(user.modtree.id, degree))
      .then((user) => dispatch(setUser(user)))
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
        <Input className="w-full mb-4" state={state.title} grayed />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <div className="w-64 flex">
            <div className="w-64 fixed">
              <SettingsSearchBox />
            </div>
          </div>
          <Button>Add Module</Button>
        </div>
        <SelectedModules modules={buildList} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button
          color="green"
          onClick={() => saveDegree(state.title[0], buildList)}
        >
          Save degree
        </Button>
      </div>
    </div>
  )
}
