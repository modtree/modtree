import { Pages } from 'types'
import { SettingsSection } from '@/ui/settings'
import { useState } from 'react'
import { Input } from '@/ui/html'
import { Button } from '@/ui/buttons'
import { SetState } from '@modtree/types'
import { useAppSelector } from '@/store/redux'
import { flatten } from '@/utils/tailwind'
import { renameGraph } from '@/store/modtree-functions'

export function Edit(props: { setPage: SetState<Pages['Graphs']> }) {
  /** hooks */
  const { buildTitle, buildId, degreeTitle } = useAppSelector((s) => s.search)
  const [title, setTitle] = useState(buildTitle)

  const update = async (title: string) => {
    props.setPage('main')
    renameGraph(buildId, title)
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
        <Input className="w-full mb-4" state={[title, setTitle]} grayed />
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
        <Button color="green" onClick={() => update(title)}>
          Save graph
        </Button>
      </div>
    </div>
  )
}
