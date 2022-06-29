import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { updateModulesDoing } from '@/store/user'
import { SelectedModules } from './selected-modules'
import { backend } from '@/utils/backend'
import { useUser } from '@/utils/auth0'

export function AddDoing(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const buildList = useAppSelector((state) => state.search.buildList)
  function confirm() {
    const codes = buildList.map((m) => m.moduleCode)
    backend.patch(`/user/${user.modtree.id}/module`, {
      status: 'doing',
      moduleCodes: codes,
    })
    dispatch(updateModulesDoing(codes))
    props.setPage('main')
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
          <SettingsSearchBox />
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
