import { Dot } from '@/ui/inline'
import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { Button } from '@/ui/buttons'
import { useSession } from '@/utils/auth'
import { inModulesPlaced } from '@/utils/graph'
import { nodify } from '@modtree/utils'
import { devEnv } from '@/utils/env'
import { addModuleNode } from '@/store/functions'

export function ModuleDetails() {
  const module = useAppSelector((state) => state.modal.modalModule)
  const { user } = useSession()
  const dispatch = useAppDispatch()

  // to check if this module has been added
  // and to toggle node
  const graph = useAppSelector((s) => s.graph)

  function handleAddButton() {
    // 1. hide module modal
    dispatch(r.hideModuleModal())
    // 2. add module to graph
    addModuleNode(nodify(module))
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
      {devEnv && (
        <pre>{JSON.stringify(module.prereqTree || 'no pre-reqs', null, 2)}</pre>
      )}
    </div>
  )
}
