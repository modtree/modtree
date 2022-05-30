import { Node, Edge } from 'react-flow-renderer'

const modules = [
  {
    moduleCode: 'CS1010',
    title: 'Programming Methodology',
    position: { x: 100, y: 200 },
  },
  {
    moduleCode: 'CS2030S',
    title: 'Programming Methodology II',
    position: { x: 450, y: 100 },
  },
  {
    moduleCode: 'CS2040S',
    title: 'Data Structures and Algorithms',
    position: { x: 450, y: 300 },
  },
  {
    moduleCode: 'CS2103T',
    title: 'Software Engineering',
    position: { x: 800, y: 200 },
  },
  {
    moduleCode: 'CS2102',
    title: 'Database Systems',
    position: { x: 800, y: 0 },
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
  selectable: true,
}))

const initialEdges: Edge[] = [
  {
    id: 'CS1010-CS2040S-or-something-cool',
    source: 'CS1010',
    target: 'CS2040S',
    animated: true,
  },
  { id: 'CS1010-CS2030S', source: 'CS1010', target: 'CS2030S', animated: true },
  {
    id: 'CS2030S-CS2103T',
    source: 'CS2030S',
    target: 'CS2103T',
    animated: true,
  },
  { id: 'yes', source: 'CS2030S', target: 'CS2102', animated: true },
]

export { initialEdges, initialNodes }
