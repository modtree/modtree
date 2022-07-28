import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { Dispatch, SetStateAction } from 'react'
import { Button } from '@/ui/buttons'
import { resetUser } from '@/store/functions'

export function Main(props: {
  setPage: Dispatch<SetStateAction<Pages['Account']>>
}) {
  return (
    <div className="mb-12">
      <SettingsSection title="Account">
        <h3 className="text-red-500">Danger zone</h3>
        <div className="mb-2">
          Reset your account to no modules done, no modules doing, with a
          default degree and a default graph.
        </div>
        <div className="flex flex-row-reverse">
          <Button color="red" onClick={() => resetUser()}>
            Reset account
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}
