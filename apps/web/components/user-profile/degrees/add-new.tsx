import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList } from '@/store/search'
import { updateUser } from '@/utils/rehydrate'
import { trpc } from '@/utils/trpc'
import { useSession } from '@/utils/auth'
import { SelectedModules } from '../modules/selected-modules'

export function AddNew(props: { setPage: SetState<Pages['Degrees']> }) {
  const dispatch = useAppDispatch()
  const { user } = useSession()

  const state = {
    title: useState<string>(''),
  }

  const buildList = useAppSelector((state) => state.search.buildList)
  useEffect(() => {
    dispatch(clearBuildList())
  }, [])

  async function saveDegree() {
    const userId = user?.modtreeId
    if (userId) {
      trpc
        .mutation('degree/create', {
          title: state.title[0],
          moduleCodes: buildList,
        })
        .then((degree) =>
          trpc.mutation('user/insert-degrees', {
            userId,
            degreeIds: [degree.id],
          })
        )
        .then(() => updateUser())
        .then(() => props.setPage('main'))
    }
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Add new"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input
          className="w-full mb-4"
          state={state.title}
          grayed
          cypress="add-degree-title"
        />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <div className="w-64 flex">
            <div className="w-64 fixed">
              <SettingsSearchBox cypress="degree-modules-search" />
            </div>
          </div>
        </div>
        <SelectedModules
          modules={buildList}
          cypress="degree-modules-list"
          cypressModule="degree-module"
        />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={saveDegree}>
          Save degree
        </Button>
      </div>
    </div>
  )
}
