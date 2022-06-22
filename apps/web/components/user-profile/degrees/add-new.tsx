import { ModuleSimple, Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useState } from 'react'
import { Input } from '@/components/html'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { Button } from '@/ui/buttons'
import { handleSearch } from '@/utils/backend'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/store/redux'
import { UseState } from '@modtree/types'
import { Dispatch } from 'redux'

function Search(props: { state: UseState<string>; dispatch: Dispatch }) {
  return (
    <input
      className="w-48 mb-4 mr-2"
      value={props.state[0]}
      onChange={(e) => {
        handleSearch({
          clear: clearSearches,
          set: setSearchedModuleCondensed,
          dispatch: props.dispatch,
          value: e.target.value,
        })
        props.state[1](e.target.value)
      }}
    />
  )
}

export function AddNew(props: { setPage: UseState<Pages['Degrees']>[1] }) {
  const state = {
    title: useState<string>(''),
    moduleCode: useState<string>(''),
    modules: useState<ModuleSimple[]>([{ title: 'yes', moduleCode: 'MA1000' }]),
  }
  const searchResults = useAppSelector((state) => state.search.moduleCondensed)
  const dispatch = useDispatch()
  const [modules] = state.modules
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
        <div className="flex flex-row">
          <Search state={state.moduleCode} dispatch={dispatch} />
          <Button>Add Module</Button>
        </div>
        <div>{JSON.stringify(searchResults)}</div>
        {modules.length !== 0 && (
          <div className="ui-rectangle flex flex-col overflow-hidden">
            {modules.map((module, index) => (
              <Row.Module key={dashed(module.moduleCode, index)}>
                <span className="font-semibold">{module.moduleCode}</span>
                <span className="mx-1">/</span>
                {module.title}
              </Row.Module>
            ))}
          </div>
        )}
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green">Save degree</Button>
      </div>
    </div>
  )
}
