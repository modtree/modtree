import { FlowNodeCondensed } from '@modtree/types'
import { useAppDispatch } from '@/store/redux'
import { toggleGraphModule } from '@/store/base'

const testNode = {
  moduleCode: 'CS1010',
  title: 'Programming Methodology',
  position: { x: 100, y: 200 },
}

export function addNode(node: FlowNodeCondensed) {
  const dispatch = useAppDispatch()
  dispatch(toggleGraphModule(testNode))
  console.log('add node')
  alert('add node')
}
