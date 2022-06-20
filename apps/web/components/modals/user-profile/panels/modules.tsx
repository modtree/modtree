import { ModuleSimple } from 'types'
import { ModuleStatus } from '@modtree/types'
import { ModulesSection } from '@/ui/settings'

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

export function ModulesTabContent() {
  return (
    <>
      <ModulesSection
        contents={moduleContent.doing}
        title="Modules Doing"
        addButtonText="Add doing"
        summary="This is a list of modules that are currently in progess this semester. They will be automatically marked as when finals week is over."
        emptySummary="There are no modules that are currently in progress."
      />
      <ModulesSection
        contents={moduleContent.done}
        title="Modules Done"
        addButtonText="Add done"
        summary="This is a list of completed modules."
        emptySummary="There are no modules that are completed."
      />
      <div className="my-12 text-center">Empty debug ↓</div>
      <ModulesSection
        contents={[]}
        title="Modules Doing"
        addButtonText="Add doing"
        summary="This is a list of modules that are currently in progess this semester. They will be automatically marked as when finals week is over."
        emptySummary="There are no modules that are currently in progress."
      />
      <ModulesSection
        contents={[]}
        title="Modules Done"
        addButtonText="Add done"
        summary="This is a list of completed modules."
        emptySummary="There are no modules that are completed."
      />
    </>
  )
}
