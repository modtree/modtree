import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { Dispatch, SetStateAction } from 'react'

export function AddNew(props: {
  setPage: Dispatch<SetStateAction<Pages['Degrees']>>
}) {
  return (
    <div className="mb-12">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Add new"
        addButtonText="Add degree"
      >
        <p>what's up</p>
      </SettingsSection>
    </div>
  )
}
