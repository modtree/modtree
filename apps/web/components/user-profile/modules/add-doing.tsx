import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { Button } from '@/ui/buttons'
import { ModuleStatus, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { SelectedModules } from './selected-modules'
import { setModuleStatus } from '@/store/functions'

export function AddDoing(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const buildList = useAppSelector((state) => state.search.buildList)

  function confirm() {
    /** navigate back */
    props.setPage('main')
    dispatch(r.clearBuildList())
    /** persist state */
    setModuleStatus(ModuleStatus.DOING, buildList)
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Modules doing"
        onBack={() => props.setPage('main')}
        title="Update"
        className="mb-8"
      >
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <SettingsSearchBox cypress="add-doing-search" />
        </div>
        <SelectedModules cypress="build-list" modules={buildList} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={() => confirm()}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
