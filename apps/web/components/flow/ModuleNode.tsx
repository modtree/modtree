import { Handle, Position } from 'react-flow-renderer'

type ModuleNodeProps = {
  data: {
    moduleCode: string
    title: string
  }
}

export function ModuleNode({ data }: ModuleNodeProps) {
  return (
    <div>
      <div className="bg-white flex flex-col justify-center h-24 w-40 shadow-md rounded-md border-2 border-gray-300">
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
        <div className="h-min">
          <div className="text-2xl font-semibold text-gray-700 text-center">
            {data.moduleCode}
          </div>
          <div className="text-sm font-medium tracking-custom text-gray-400 text-center leading-5">
            {data.title}
          </div>
        </div>
      </div>
    </div>
  )
}
