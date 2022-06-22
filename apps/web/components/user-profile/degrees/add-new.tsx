import { ModuleSimple, Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Dispatch, SetStateAction, useState } from 'react'
import { Input } from '@/components/html'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { Button } from '@/ui/buttons'

export function AddNew(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
}) {
  const state = {
    title: useState<string>(''),
    moduleCode: useState<string>(''),
    modules: useState<ModuleSimple[]>([{ title: 'yes', moduleCode: 'MA1000' }]),
  }
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
          <Input className="w-48 mb-4 mr-2" state={state.moduleCode} grayed />
          <Button>Add Module</Button>
        </div>
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
