import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { Button } from '@/ui/buttons'
import { ModuleStatus, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { updateModulesDone } from '@/store/user'
import { SelectedModules } from './selected-modules'
import { useUser } from '@/utils/auth0'
import { trpc } from '@/utils/trpc'

export function AddDone(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const buildList = useAppSelector((state) => state.search.buildList)
  function confirm() {
    const moduleCodes = buildList
    dispatch(updateModulesDone(moduleCodes))
    props.setPage('main')
    /** persist state */
    const userId = user?.modtreeId
    if (!userId) return
    trpc.mutation('user/set-module-status', {
      userId,
      moduleCodes,
      status: ModuleStatus.DONE,
    })
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
