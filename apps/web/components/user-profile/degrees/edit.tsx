import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { useEffect, useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { SettingsSearchBox } from '@/ui/search/module'
import { useAppSelector } from '@/store/redux'
import { BuildList } from '../build-list'
import { setBuildTarget } from '@/store/functions'
import { trpcReact } from '@/utils/trpc'

export function Edit(props: { setPage: SetState<Pages['Degrees']> }) {
  /** hooks */
  const { buildList, buildTitle, buildId } = useAppSelector((s) => s.search)
  const [title, setTitle] = useState(buildTitle)

  const trpc = trpcReact.useContext()
  const updateHook = trpcReact.useMutation('degree/update', {
    onSuccess: () => {
      trpc.invalidateQueries(['graphs'])
      trpc.invalidateQueries(['degrees'])
    },
  })

  /* set build list */
  useEffect(() => {
    setBuildTarget(buildId)
  }, [])

  const update = async () => {
    props.setPage('main')
    updateHook.mutate({
      degreeId: buildId,
      title,
      moduleCodes: buildList,
    })
  }

  return (
    <div className="flex flex-col">
      <SettingsSection
        baseTitle="Degrees"
        onBack={() => props.setPage('main')}
        title="Edit"
        className="mb-8"
      >
        <h6>Title</h6>
        <Input
          className="w-full mb-4"
          state={[title, setTitle]}
          grayed
          cypress="edit-degree-title"
        />
        <h6>Modules</h6>
        <div className="flex flex-row space-x-2 mb-4">
          <SettingsSearchBox cypress="degree-modules-search" />
        </div>
        <BuildList
          cypress="degree-modules-list"
          cypressModule="degree-module"
        />
      </SettingsSection>
      <div className="flex flex-row-reverse">
        <Button color="green" onClick={update}>
          Save degree
        </Button>
      </div>
    </div>
  )
}
