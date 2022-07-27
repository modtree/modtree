import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { Button } from '@/ui/buttons'
import { ModuleStatus, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { BuildList } from '../build-list'
import { setModuleStatus } from '@/store/functions'

export function Add(props: {
  setPage: SetState<Pages['Modules']>
  targetStatus: ModuleStatus.DONE | ModuleStatus.DOING
}) {
  const { setPage, targetStatus } = props
  const dispatch = useAppDispatch()
  const buildList = useAppSelector((state) => state.search.buildList)

  function confirm() {
    /** navigate back */
    setPage('main')
    dispatch(r.clearBuildList())
    /** persist state */
    setModuleStatus(targetStatus, buildList)
  }

  const baseTitle = {
    [ModuleStatus.DONE]: 'Modules done',
    [ModuleStatus.DOING]: 'Modules doing',
  }[targetStatus]

  /**
   * possible TODO: use the same cypress prop for both?
   */
  const Search = {
    [ModuleStatus.DONE]: <SettingsSearchBox cypress="add-done-search" />,
    [ModuleStatus.DOING]: <SettingsSearchBox cypress="add-doing-search" />,
  }[targetStatus]

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle={baseTitle}
        onBack={() => setPage('main')}
        title="Update"
        className="mb-8"
      >
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">{Search}</div>
        <BuildList cypress="build-list" />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={() => confirm()}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
