import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { ModuleStatus, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { updateModulesDone } from '@/store/user'
import { SelectedModules } from './selected-modules'
import { useUser } from '@/utils/auth0'
import { api } from 'api'

export function AddDone(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const buildList = useAppSelector((state) => state.search.buildList)
  function confirm() {
    const codes = buildList
    const userId = user?.modtreeId
    if (!userId) return
    api.user.setModuleStatus(userId, codes, ModuleStatus.DONE)
    dispatch(updateModulesDone(codes))
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
          <SettingsSearchBox cypress="add-done-search" />
          <Button>Add Module</Button>
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
