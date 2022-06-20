import { ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import { ContextMenu } from './base'

const items = [
  { text: 'Suggest modules', callback: () => alert('suggest modules') },
  { text: 'Mark as done', callback: () => alert('marked as done') },
]

export default function FlowPaneContextMenu() {
  const show = useSelector<ModalState, ModalState['modal']['showContextMenu']>(
    (state) => state.modal.showContextMenu
  )

  return <ContextMenu show={show} items={items} />
}
