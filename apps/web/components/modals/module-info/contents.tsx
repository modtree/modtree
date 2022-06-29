import { addModuleNode } from '@/store/graph'
import { hideModuleModal } from '@/store/modal'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { Button } from '@/ui/buttons'
import { useUser } from '@/utils/auth0'

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
          id: '',
          moduleLevel: 0,
          moduleCode: module.moduleCode,
          title: module.title,
        },
      })
    )
    dispatch(hideModuleModal())
  }
  return (
    <div>
      <h1 className="text-modtree-400">{module.moduleCode}</h1>
      <h2>{module.title}</h2>
      <hr />
      {user && (
        <div className="flex flex-row-reverse">
          <Button onClick={handleAddButton}>Add to graph</Button>
        </div>
      )}
    </div>
  )
}
