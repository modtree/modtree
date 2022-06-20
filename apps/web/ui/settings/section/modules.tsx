import { Button } from '@/ui/buttons'
import { ModuleIcon } from '@/ui/icons'
import { dashed } from '@/utils/array'
import { flatten } from '@/utils/tailwind'
import { ModuleSimple, ExtendedProps } from 'types'
import { SettingsSection } from './base'

function Row(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'bg-white',
        className
      )}
      {...rest}
    >
      <ModuleIcon className="mr-2" />
      <div className="flex-1">{children}</div>
      <Button className="text-sm px-3" color="red">
        Delete
      </Button>
    </div>
  )
}

export function ModulesSection(props: {
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
                <Row key={dashed(module.moduleCode, index)}>
                  <span className="font-semibold">{module.moduleCode}</span>
                  <span className="mx-1">/</span>
                  {module.title}
                </Row>
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
