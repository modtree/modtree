import { GraphIcon } from '@/ui/icons'
import { dashed } from '@/utils/array'
import { flatten } from '@/utils/tailwind'
import { ExtendedProps, DegreeGraphs } from 'types'
import { SettingsSection } from './base'
import { EmptyBox } from '@/ui/settings/empty-box'

function HeaderRow(props: ExtendedProps['div']) {
  const { className, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'font-semibold',
        className
      )}
      {...rest}
    />
  )
}

function GraphRow(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <HeaderRow className={flatten('bg-white font-normal', className)} {...rest}>
      <GraphIcon className="mr-2" />
      <a>{children}</a>
    </HeaderRow>
  )
}

export function GraphsSection(props: {
  contents: DegreeGraphs[]
  title: string
  summary?: string
}) {
  const hasGraphs = props.contents.length !== 0
  const { title, contents, summary } = props
  return (
    <div className="mb-12">
      <SettingsSection title={title} addButtonText={hasGraphs && 'New graph'}>
        {hasGraphs ? (
          <>
            {summary && <p>{summary}</p>}
            <div className="ui-rectangle flex flex-col overflow-hidden">
              <HeaderRow>
                <GraphIcon className="mr-2" />
                Graphs
              </HeaderRow>
              {contents.map(({ degree, graphs }, index) => (
                <>
                  <HeaderRow key={dashed(degree, index)}>{degree}</HeaderRow>
                  {graphs.map((graph, index) => (
                    <GraphRow key={dashed(degree, graph, index)}>
                      {degree}/{graph}
                    </GraphRow>
                  ))}
                </>
              ))}
            </div>
          </>
        ) : (
          <EmptyBox
            summary="There are no graphs for this user"
            buttonText="New graph"
          />
        )}
      </SettingsSection>
    </div>
  )
}
