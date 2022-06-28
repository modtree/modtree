import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { updateModulesDone } from '@/store/user'
import { SelectedModules } from './selected-modules'
import { updateCachedModulesCondensed } from '@/utils/backend'

export function AddDone(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const buildList = useAppSelector((state) => state.search.buildList)
  function confirm() {
    const codes = buildList.map((m) => m.moduleCode)
    dispatch(updateModulesDone(codes))
    updateCachedModulesCondensed(dispatch, codes)
    props.setPage('main')
  }
  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Modules done"
        onBack={() => props.setPage('main')}
        title="Update"
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
        <Button color="green" onClick={() => confirm()}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
