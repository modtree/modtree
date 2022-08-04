import { empty, FlowNodeState, IModule } from '@modtree/types'
import { nodify } from './get-nodes'

it('works', () => {
  const module: IModule = {
    ...empty.Module,
    moduleCode: 'CS1010',
  }
  const state: FlowNodeState = 'done'

  const res = nodify(module, state)
  expect(res.id).toEqual(module.moduleCode)
  expect(res.data).toEqual(module)
  expect(res.type).toEqual(state)
  expect(res.position).toEqual({ x: 0, y: 0 })
})
