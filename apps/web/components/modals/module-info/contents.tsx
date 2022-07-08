import { Dot } from '@/ui/inline'
import { addModuleNode } from '@/store/graph'
import { hideModuleModal } from '@/store/modal'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { Button } from '@/ui/buttons'
import { useUser } from '@/utils/auth0'
import { empty } from '@modtree/utils'
import { inModulesPlaced } from '@/utils/graph'

export function ModuleDetails() {
  const module = useAppSelector((state) => state.modal.modalModule)
  const { user } = useUser()
  const dispatch = useAppDispatch()
  function handleAddButton() {
    dispatch(
      addModuleNode({
        id: module.moduleCode,
        position: {
          x: 0,
          y: 0,
        },
        type: 'moduleNode',
        data: {
          ...empty.Module,
          moduleCode: module.moduleCode,
          title: module.title,
        },
      })
    )
    dispatch(hideModuleModal())
  }

  // get main graph to chek if this module has been added
  const mainGraph = useAppSelector((state) => state.user.mainGraph)

  return (
    <div>
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
      {user && !inModulesPlaced(mainGraph, module.moduleCode) && (
        <div className="flex flex-row-reverse">
          <Button onClick={handleAddButton}>Add to graph</Button>
        </div>
      )}
    </div>
  )
}
