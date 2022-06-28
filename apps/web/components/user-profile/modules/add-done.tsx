import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { ModuleCondensed } from '@modtree/entity'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { removeFromBuildList } from '@/store/search'

function SelectedModules(props: { modules: ModuleCondensed[] }) {
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

export function AddDone(props: { setPage: SetState<Pages['Modules']> }) {
  const buildList = useAppSelector((state) => state.search.buildList)
  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Modules done"
        onBack={() => props.setPage('main')}
        title="Add new"
        className="mb-8"
      >
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
        <Button color="green">Save degree</Button>
      </div>
    </div>
  )
}
