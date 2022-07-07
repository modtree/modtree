import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { SetState } from '@modtree/types'
import { Pages } from 'types'

export function AddNew(props: { setPage: SetState<Pages['Graphs']> }) {
  const state = {
    title: useState<string>(''),
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Graphs"
        onBack={() => props.setPage('main')}
        title="Add new"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input className="w-full mb-4" state={state.title} grayed />
        <h6>Degree</h6>
        <Input className="w-full mb-4" state={state.title} grayed />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green">Save graph</Button>
      </div>
    </div>
  )
}
