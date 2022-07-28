import { cc } from '@/utils/tailwind'
import { IModuleCondensed } from '@modtree/types'
import { Handle, Position } from 'react-flow-renderer'
import { ModuleNodeProps } from 'types'

const Title = (props: { className?: string; title: string }) => {
  const { className, title } = props
  return (
    <div
      className={cc(
        'text-sm font-medium',
        'tracking-custom text-center',
        'leading-5 text-gray-500',
        className
      )}
    >
      {title}
    </div>
  )
}

const ModuleCode = (props: { className?: string; moduleCode: string }) => {
  const { className, moduleCode } = props
  return (
    <div className={cc('text-2xl font-semibold text-center', className)}>
      {moduleCode}
    </div>
  )
}

export function ModuleNode(props: ModuleNodeProps) {
  const { moduleCode, title, className } = props.data
  return (
    <div
      className={cc(
        'h-24 w-40',
        'px-2 bg-white',
        'flex flex-col justify-center',
        'shadow-md rounded-md'
      )}
      data-cy={`node-${moduleCode}`}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="h-min">
        <ModuleCode className={className?.moduleCode} moduleCode={moduleCode} />
        <Title className={className?.title} title={title} />
      </div>
    </div>
  )
}
