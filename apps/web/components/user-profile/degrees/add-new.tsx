import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { Button } from '@/ui/buttons'
import { InitDegreeProps, SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { clearBuildList, removeFromBuildList } from '@/store/search'
import { useUser } from '@/utils/auth0'
import { updateUser } from '@/utils/rehydrate'
import { trpc } from '@/utils/trpc'

function SelectedModules(props: { modules: string[] }) {
  const dispatch = useAppDispatch()
  const cache = useAppSelector((state) => state.cache)
  return (
    <>
      {props.modules.length !== 0 && (
        <div className="ui-rectangle flex flex-col overflow-hidden">
          {props.modules.map((code, index) => {
            const module = cache.modules[code]
            return (
              <Row.Module
                key={dashed(code, index)}
                deletable
                onDelete={() => dispatch(removeFromBuildList(code))}
              >
                <span className="font-semibold">{code}</span>
                <span className="mx-1">/</span>
                {module && module.title}
              </Row.Module>
            )
          })}
        </div>
      )}
    </>
  )
}

export function AddNew(props: { setPage: SetState<Pages['Degrees']> }) {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const state = {
    title: useState<string>(''),
  }

  const buildList = useAppSelector((state) => state.search.buildList)
  useEffect(() => {
    dispatch(clearBuildList())
  }, [])

  async function saveDegree() {
    const degreeProps: InitDegreeProps = {
      title: state.title[0],
      moduleCodes: buildList,
    }
    const userId = user?.modtreeId
    if (userId) {
      trpc
        .mutation('degree/create', degreeProps)
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
        <Input className="w-full mb-4" state={state.title} grayed />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <div className="w-64 flex">
            <div className="w-64 fixed">
              <SettingsSearchBox />
            </div>
          </div>
          <Button>Add Module</Button>
        </div>
        <SelectedModules modules={buildList} />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={saveDegree}>
          Save degree
        </Button>
      </div>
    </div>
  )
}
