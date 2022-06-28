import { dashed } from '@/utils/array'
import { ModuleSimple } from 'types'
import { SettingsSection } from './base'
import { Row } from './rows'

export function ModuleListSection(props: {
  contents: ModuleSimple[]
  title: string
  summary: string
  emptySummary: string
  addButtonText: string
  onAddClick: () => void
}) {
  const hasModules = props.contents.length !== 0
  return (
    <div className="mb-12">
      <SettingsSection
        title={props.title}
        addButtonText={props.addButtonText}
        onAddClick={props.onAddClick}
      >
        {hasModules ? (
          <>
            <p>{props.summary}</p>
            <div className="ui-rectangle flex flex-col overflow-hidden">
              {props.contents.map((module, index) => (
                <Row.Module key={dashed(module.moduleCode, index)}>
                  <span className="font-semibold">{module.moduleCode}</span>
                  <span className="mx-1">/</span>
                  {module.title}
                </Row.Module>
              ))}
            </div>
          </>
        ) : (
          <p>{props.emptySummary}</p>
        )}
      </SettingsSection>
    </div>
  )
}
