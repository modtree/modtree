import { IModuleCondensed } from '@modtree/types'
import { Handle, Position } from 'react-flow-renderer'

export function ModuleNode(props: { data: IModuleCondensed }) {
  return (
    <div className="bg-white flex flex-col justify-center h-24 w-40 shadow-md rounded-md">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="h-min">
        <div className="text-2xl font-semibold text-center">
          {props.data.moduleCode}
        </div>
        <div className="text-sm font-medium tracking-custom text-center leading-5">
          {props.data.title}
        </div>
      </div>
    </div>
  )
}
