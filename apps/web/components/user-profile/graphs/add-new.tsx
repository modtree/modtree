import { SettingsSection } from '@/ui/settings/lists/base'
import { Button } from '@/ui/buttons'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { IDegree, SetState } from '@modtree/types'
import { Pages } from 'types'
import { PickOne } from '@/ui/search/degree/pick-one'
import { useAppSelector } from '@/store/redux'

export function AddNew(props: { setPage: SetState<Pages['Graphs']> }) {
  const degrees = useAppSelector((state) => state.user.savedDegrees)
  const state = {
    title: useState<string>(''),
    degree: useState<IDegree>(degrees[0]),
    pullAll: useState<boolean>(true),
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
        <PickOne degrees={degrees} select={state.degree} pull={state.pullAll} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green">Save graph</Button>
      </div>
    </div>
  )
}