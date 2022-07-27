import { cc } from '@/utils/tailwind'
import { IModuleCondensed } from '@modtree/types'
import { Handle, Position } from 'react-flow-renderer'

const Title = (props: { className: string; title: string }) => {
  return (
    <div
      className={cc(
        'text-sm font-medium',
        'tracking-custom text-center',
        'leading-5 text-gray-500',
        props.className
      )}
    >
      {props.title}
    </div>
  )
}

const ModuleCode = (props: { className: string; moduleCode: string }) => {
  return (
    <div className={cc('text-2xl font-semibold text-center', props.className)}>
      {props.moduleCode}
    </div>
  )
}

export function ModuleNode(props: {
  data: IModuleCondensed & { className?: { moduleCode: string; title: string } }
}) {
  const { moduleCode, title } = props.data
  // use blank strings as default classNames for tailwind
  const className = Object.assign(
    { moduleCode: '', title: '' },
    props.data.className
  )
  return (
    <div
      className="h-24 w-40 px-2 bg-white flex flex-col justify-center shadow-md rounded-md"
      data-cy={`node-${moduleCode}`}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="h-min">
        <ModuleCode className={className.moduleCode} moduleCode={moduleCode} />
        <Title className={className.title} title={title} />
      </div>
    </div>
  )
}
