import { Dot } from '@/components/inline'
import { useAppSelector } from '@/store/redux'
import { Button } from '@/ui/buttons'
import { addNode } from './add-node'

const testNode = {
  moduleCode: 'CS1010',
  title: 'Programming Methodology',
  position: { x: 100, y: 200 },
}

export function ModuleDetails() {
  const module = useAppSelector((state) => state.modal.modalModule)
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
        <Button onClick={() => addNode(testNode)}>Add to graph</Button>
      </div>
    </div>
  )
}
