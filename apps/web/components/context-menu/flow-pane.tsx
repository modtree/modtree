import { useAppSelector } from '@/store/redux'
import { ContextMenu } from './base'

const items = [
  { text: 'Suggest modules', callback: () => alert('suggest modules') },
  { text: 'Mark as done', callback: () => alert('marked as done') },
]

export default function FlowPaneContextMenu() {
  const show = useAppSelector((state) => state.modal.showContextMenu)

  return <ContextMenu show={show} items={items} />
}
