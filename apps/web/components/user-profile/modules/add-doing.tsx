import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { Button } from '@/ui/buttons'
import { ModuleStatus, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { updateModulesDoing } from '@/store/user'
import { SelectedModules } from './selected-modules'
import { useUser } from '@/utils/auth0'
import { trpc } from '@/utils/trpc'

export function AddDoing(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const buildList = useAppSelector((state) => state.search.buildList)
  const { user } = useUser()
  function confirm() {
    const moduleCodes = buildList
    dispatch(updateModulesDoing(moduleCodes))
    props.setPage('main')
    /** persist state */
    const userId = user?.modtreeId
    if (!userId) return
    trpc.mutation('user/set-module-status', {
      userId,
      moduleCodes,
      status: ModuleStatus.DOING,
    })
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
