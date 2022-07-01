import dagre from 'dagre'

const g = new dagre.graphlib.Graph()

// Set an object for the graph label
g.setGraph({})

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(function () {
  return {}
})

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.
g.setNode('kspacey', { label: 'Kevin Spacey', width: 144, height: 100 })
g.setNode('swilliams', { label: 'Saul Williams', width: 160, height: 100 })
g.setNode('bpitt', { label: 'Brad Pitt', width: 108, height: 100 })
g.setNode('hford', { label: 'Harrison Ford', width: 168, height: 100 })
g.setNode('lwilson', { label: 'Luke Wilson', width: 144, height: 100 })
g.setNode('kbacon', { label: 'Kevin Bacon', width: 121, height: 100 })

// Add edges to the graph.
g.setEdge('kspacey', 'swilliams')
g.setEdge('swilliams', 'kbacon')
g.setEdge('bpitt', 'kbacon')
g.setEdge('hford', 'lwilson')
g.setEdge('lwilson', 'kbacon')

test('yes', () => {
  dagre.layout(g)
  g.nodes().forEach((v) => {
    // console.log(g.node(v))
  })
  expect(1).toBe(1)
})
