import { ModuleSimple, Pages } from 'types'
import { ModuleStatus, SetState } from '@modtree/types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'

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
  const hasModules = {
    done: moduleContent.done.length !== 0,
    doing: moduleContent.doing.length !== 0,
  }
  return (
    <>
      <div className="mb-12">
        <SettingsSection
          title="Modules Doing"
          addButtonText="Add doing"
          onAddClick={() => props.setPage('add-doing')}
        >
          {hasModules ? (
            <>
              <p>{text.moduleListSection.doing.summary}</p>
              <div className="ui-rectangle flex flex-col overflow-hidden">
                {moduleContent.doing.map((module, index) => (
                  <Row.Module key={dashed(module.moduleCode, index)}>
                    <span className="font-semibold">{module.moduleCode}</span>
                    <span className="mx-1">/</span>
                    {module.title}
                  </Row.Module>
                ))}
              </div>
            </>
          ) : (
            <p>{text.moduleListSection.doing.emptySummary}</p>
          )}
        </SettingsSection>
      </div>
      <div className="mb-12">
        <SettingsSection
          title="Modules Done"
          addButtonText="Add done"
          onAddClick={() => props.setPage('add-done')}
        >
          {hasModules ? (
            <>
              <p>{text.moduleListSection.done.summary}</p>
              <div className="ui-rectangle flex flex-col overflow-hidden">
                {moduleContent.done.map((module, index) => (
                  <Row.Module key={dashed(module.moduleCode, index)}>
                    <span className="font-semibold">{module.moduleCode}</span>
                    <span className="mx-1">/</span>
                    {module.title}
                  </Row.Module>
                ))}
              </div>
            </>
          ) : (
            <p>{text.moduleListSection.done.emptySummary}</p>
          )}
        </SettingsSection>
      </div>
    </>
  )
}
