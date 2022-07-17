import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { useAppSelector } from '@/store/redux'
import { flatten } from '@/utils/tailwind'

export function Edit(props: { setPage: SetState<Pages['Graphs']> }) {
  const { buildTitle, degreeTitle } = useAppSelector((state) => state.search)
  const state = {
    title: useState<string>(buildTitle),
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Graphs"
        onBack={() => props.setPage('main')}
        title="Edit"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input className="w-full mb-4" state={state.title} grayed />
        <h6>Degree</h6>
        <div
          className={flatten(
            'ui-rectangle shadow-none h-8 w-64',
            'cursor-not-allowed select-none',
            'flex justify-center items-center'
          )}
        >
          {degreeTitle}
        </div>
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green">Save graph</Button>
      </div>
    </div>
  )
}
