import { flatten } from '@/utils/tailwind'
import { IModuleCondensed } from '@modtree/types'
import { Handle, Position } from 'react-flow-renderer'

export function ModuleNode(props: {
  data: IModuleCondensed & { className?: { moduleCode: string; title: string } }
}) {
  const { moduleCode, title, className } = props.data
  return (
    <div
      className={flatten(
        'h-24 w-40 px-2',
        'bg-white flex flex-col justify-center',
        'shadow-md rounded-md'
      )}
      data-cy={`node-${moduleCode}`}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="h-min">
        <div
          className={flatten(
            'text-2xl font-semibold text-center',
            className?.moduleCode
          )}
        >
          {moduleCode}
        </div>
        <div
          className={flatten(
            'text-sm font-medium',
            'tracking-custom text-center',
            'leading-5 text-gray-500',
            className?.title
          )}
        >
          {title}
        </div>
      </div>
    </div>
  )
}
