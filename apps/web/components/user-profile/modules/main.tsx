import { ModuleSimple, Pages } from 'types'
import { ModuleStatus, SetState } from '@modtree/types'
import { ModuleListSection } from '@/ui/settings'

type ModuleContent = Record<ModuleStatus, ModuleSimple[]>

const moduleContent: ModuleContent = {
  done: [
    {
      title: 'Linear Algebra',
      moduleCode: 'MA2001',
    },
    {
      title: 'Calculus',
      moduleCode: 'MA2002',
    },
  ],
  doing: [
    {
      title: 'Introduction to Geometry',
      moduleCode: 'MA2219',
    },
    {
      title: 'Design Thinking',
      moduleCode: 'DTK1234',
    },
  ],
  notTaken: [],
}

export function Main(props: { setPage: SetState<Pages['Modules']> }) {
  return (
    <>
      <ModuleListSection
        contents={moduleContent.doing}
        title="Modules Doing"
        addButtonText="Add doing"
        onAddClick={() => props.setPage('add-doing')}
        summary="This is a list of modules that are currently in progess this semester. They will be automatically marked as when finals week is over."
        emptySummary="There are no modules that are currently in progress."
      />
      <ModuleListSection
        contents={moduleContent.done}
        title="Modules Done"
        addButtonText="Add done"
        onAddClick={() => props.setPage('add-done')}
        summary="This is a list of completed modules."
        emptySummary="There are no modules that are completed."
      />
    </>
  )
}
