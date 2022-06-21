import { Dot } from '@/components/inline'
import { addModuleNode } from '@/store/base'
import { hideModuleModal } from '@/store/modal'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { Button } from '@/ui/buttons'

export function ModuleDetails() {
  const module = useAppSelector((state) => state.modal.modalModule)
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
      <p className="subtitle mb-4">
        <span>{module.department}</span>
        <Dot />
        <span>{module.faculty}</span>
        <Dot />
        <span>{module.moduleCredit} MCs</span>
      </p>
      <hr />
      <p className="mb-6">{module.description}</p>
      <div className="flex flex-row-reverse">
        <Button onClick={handleAddButton}>Add to graph</Button>
      </div>
    </div>
  )
}
