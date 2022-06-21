import { FlowNodeCondensed } from '@modtree/types'
import { useAppDispatch } from '@/store/redux'
import { toggleGraphModule } from '@/store/base'

export function addNode(node: FlowNodeCondensed) {
  const dispatch = useAppDispatch()
  dispatch(toggleGraphModule(node))
  console.log('add node')
  alert('add node')
}
