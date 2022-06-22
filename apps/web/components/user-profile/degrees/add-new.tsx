import { ModuleSimple, Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useState } from 'react'
import { Input } from '@/components/html'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { ModuleCondensed } from '@modtree/entity'

function SelectedModules(props: { modules: ModuleSimple[] }) {
  return (
    <>
      {props.modules.length !== 0 && (
        <div className="ui-rectangle flex flex-col overflow-hidden">
          {props.modules.map((module, index) => (
            <Row.Module key={dashed(module.moduleCode, index)}>
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
  const state = {
    title: useState<string>(''),
    moduleCode: useState<string>(''),
    modules: useState<ModuleCondensed[]>([
      { title: 'yes', moduleCode: 'MA1000', moduleLevel: 1000, id: '' },
    ]),
  }
  // const searchResults = useAppSelector((state) => state.search.moduleCondensed)
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
        <div className="flex flex-row space-x-2 mb-4">
          <SettingsSearchBox />
          <Button>Add Module</Button>
        </div>
        <SelectedModules modules={modules} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green">Save degree</Button>
      </div>
    </div>
  )
}