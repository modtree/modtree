import { H2, P } from '@/components/html'
import { Button } from '@/components/buttons'
import { ExtendedProps } from '@/types'
import { flatten } from '@/utils/tailwind'
import { CubeIcon } from '@heroicons/react/outline'
import { ModuleCondensed } from '@modtree/entity'
import { ModuleStatus } from '@modtree/types'
import { dashed } from '@/utils/array'

type ModuleSimple = Pick<ModuleCondensed, 'title' | 'moduleCode'>
type ModuleContent = Record<ModuleStatus, ModuleSimple[]>

const iconSize = '16px'
const ModuleIcon = () => (
  <CubeIcon
    style={{ height: iconSize, width: iconSize }}
    className="mr-2 text-gray-700 inline"
  />
)

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

function Row(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'tracking-normal bg-white',
        className
      )}
      {...rest}
    >
      <ModuleIcon />
      <div className="flex-1">{children}</div>
      <Button className="text-xs px-3" color="red">
        Delete
      </Button>
    </div>
  )
}

function ModulesSection(props: {
  contents: ModuleSimple[]
  title: string
  emptyMessage: string
}) {
  const hasModules = props.contents.length !== 0
  return (
    <div className="mb-12">
      <H2 underline>
        <div className="flex flex-row">
          <span className="flex-1">{props.title}</span>
          <Button color="green">Add doing</Button>
        </div>
      </H2>
      {hasModules ? (
        <div className="ui-rectangle flex flex-col text-sm overflow-hidden">
          {moduleContent.doing.map((module, index) => (
            <Row key={dashed(module.moduleCode, index)}>
              <span className="font-semibold">{module.moduleCode}</span>
              <span className="mx-1">/</span>
              {module.title}
            </Row>
          ))}
        </div>
      ) : (
        <P>{props.emptyMessage}</P>
      )}
    </div>
  )
}

export default function ModulesTabContent() {
  return (
    <>
      <ModulesSection
        title="Modules Doing"
        contents={moduleContent.doing}
        emptyMessage="There are no modules that are currently in progress."
      />
      <ModulesSection
        title="Modules Done"
        contents={moduleContent.done}
        emptyMessage="There are no modules that are completed."
      />
      <ModulesSection
        title="Modules Doing"
        contents={[]}
        emptyMessage="There are no modules that are currently in progress."
      />
      <ModulesSection
        title="Modules Done"
        contents={[]}
        emptyMessage="There are no modules that are completed."
      />
    </>
  )
}
