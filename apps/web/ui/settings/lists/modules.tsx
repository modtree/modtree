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
}) {
  const hasModules = props.contents.length !== 0
  const { title, contents, summary, emptySummary, addButtonText } = props
  return (
    <div className="mb-12">
      <SettingsSection title={title} addButtonText={addButtonText}>
        {hasModules ? (
          <>
            <p>{summary}</p>
            <div className="ui-rectangle flex flex-col overflow-hidden">
              {contents.map((module, index) => (
                <Row.Module key={dashed(module.moduleCode, index)}>
                  <span className="font-semibold">{module.moduleCode}</span>
                  <span className="mx-1">/</span>
                  {module.title}
                </Row.Module>
              ))}
            </div>
          </>
        ) : (
          <p>{emptySummary}</p>
        )}
      </SettingsSection>
    </div>
  )
}
