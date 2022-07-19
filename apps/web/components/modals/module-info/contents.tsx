import { Dot } from '@/ui/inline'
import { setGraph, setFlow } from '@/store/graph'
import { hideModuleModal } from '@/store/modal'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { Button } from '@/ui/buttons'
import { useSession } from '@/utils/auth'
import { inModulesPlaced } from '@/utils/graph'
import { GraphFlowNode } from '@modtree/types'
import { redrawGraph } from '@modtree/utils'
import { trpc } from '@/utils/trpc'

export function ModuleDetails() {
  const module = useAppSelector((state) => state.modal.modalModule)
  const { user } = useSession()
  const dispatch = useAppDispatch()

  // to check if this module has been added
  // and to toggle node
  const graph = useAppSelector((state) => state.graph)

  function handleAddButton() {
    // 1. hide module modal
    dispatch(hideModuleModal())

    // 2. calculate new nodes and edges
    const node: GraphFlowNode = {
      id: module.moduleCode,
      position: {
        x: 0,
        y: 0,
      },
      type: 'moduleNode',
      data: {
        // basically extract IModule from IFull
        id: module.id,
        moduleCode: module.moduleCode,
        title: module.title,
        prerequisite: module.prerequisite,
        corequisite: module.corequisite,
        preclusion: module.preclusion,
        fulfillRequirements: module.fulfillRequirements,
        prereqTree: module.prereqTree,
      },
    }
    const { nodes, edges } = redrawGraph({
      nodes: [...graph.flowNodes, node],
      edges: graph.flowEdges,
    })

    // 3. toggle module in graph
    trpc
      .mutation('graph/toggle', {
        graphId: graph.id,
        moduleCode: module.moduleCode,
      })
      .then(() =>
        // 4. update frontend props
        trpc.mutation('graph/update-frontend-props', {
          graphId: graph.id,
          flowNodes: nodes,
          flowEdges: edges,
        })
      )
      .then((g) => {
        setGraph(g)
        // 5. Dispatch new nodes
        dispatch(
          setFlow({
            flowNodes: nodes,
            flowEdges: edges,
          })
        )
      })
  }
  return (
    <div data-cy="module-modal">
      <h1 className="text-modtree-400">{module.moduleCode}</h1>
      <h2>{module.title}</h2>
      <p className="subtitle mb-4">
        <span>{module.department}</span>
        <Dot />
        <span>{module.faculty}</span>
        <Dot />
        <span>{module.moduleCredit} MCs</span>
      </p>
      <hr />
      <p className="mb-6">{module.description}</p>
      {user && !inModulesPlaced(graph, module.moduleCode) && (
        <div className="flex flex-row-reverse">
          <Button onClick={handleAddButton}>Add to graph</Button>
        </div>
      )}
    </div>
  )
}
