import ReactFlow, {
  MiniMap,
  Controls,
  Node,
  Edge,
  ReactFlowProps,
} from 'react-flow-renderer'

function Flow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: ReactFlowProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
    </ReactFlow>
  )
}

export default function Modtree() {
  const defaultNodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 250, y: 5 },
      className: 'light',
      draggable: true,
      selectable: true
    },
    {
      id: '2',
      data: { label: 'Node 2' },
      position: { x: 100, y: 100 },
      className: 'light',
    },
    {
      id: '3',
      data: { label: 'Node 3' },
      position: { x: 400, y: 100 },
      className: 'light',
    },
    {
      id: '4',
      data: { label: 'Node 4' },
      position: { x: 400, y: 200 },
      className: 'light',
    },
  ]

  const defaultEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
  ]
  return (
    <div className='h-screen w-screen bg-green-100'>
      <Flow nodes={defaultNodes} edges={defaultEdges} />
    </div>
  )
}
