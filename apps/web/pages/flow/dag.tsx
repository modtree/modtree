import { Node, Edge, Position, Handle } from 'react-flow-renderer'

export function ModuleNode({ data }: any) {
  return (
    <div className="bg-white flex flex-col justify-center h-24 w-40 shadow-md rounded-md border-2 border-gray-300">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="h-min">
        <div className="text-2xl font-semibold text-gray-700 text-center">
          {data.moduleCode}
        </div>
        <div className="text-sm font-medium tracking-tight text-gray-400 text-center leading-5">
          {data.title}
        </div>
      </div>
    </div>
  )
}

const modules = [
  {
    moduleCode: 'CS1010',
    title: 'Programming Methodology',
    position: { x: 250, y: 25 },
  },
  {
    moduleCode: 'CS2030S',
    title: 'Programming Methodology II',
    position: { x: 100, y: 125 },
  },
  {
    moduleCode: 'CS2040S',
    title: 'Data Structures and Algorithms',
    position: { x: 250, y: 250 },
  },
]

const initialNodes: Node[] = modules.map((m) => ({
  id: m.moduleCode,
  type: 'moduleNode',
  data: {
    title: m.title,
    moduleCode: m.moduleCode,
  },
  position: m.position,
}))

const initialEdges: Edge[] = [
  {
    id: 'CS1010-CS2040S-or-something-cool',
    source: 'CS1010',
    target: 'CS2040S',
    animated: true,
  },
  { id: 'CS1010-CS2030S', source: 'CS1010', target: 'CS2030S', animated: true },
]

export { initialEdges, initialNodes }
