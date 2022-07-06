import { ContextMenu } from './base'
import { useAppSelector } from '@/store/redux'
import { dashed } from '@/utils/array'

const items = {
  node: [
    { text: 'More info', callback: () => alert('more info about this module') },
    { text: 'Suggest modules', callback: () => alert('suggest modules') },
    { text: 'Mark as done', callback: () => alert('marked as done') },
    { text: 'Remove', callback: () => alert('remove node') },
  ],
  pane: [
    { text: 'Suggest modules', callback: () => alert('suggest modules') },
    { text: 'Mark as done', callback: () => alert('marked as done') },
  ],
}

export function ContextMenus() {
  const { showContextMenu, contextMenuProps } = useAppSelector(
    (state) => state.modal
  )
  const menus = ['node', 'pane']
  const selected = contextMenuProps.menu
  return (
    <>
      {menus.map((menu, index) => (
        <ContextMenu
          key={dashed('modtree-context', menu, index)}
          show={showContextMenu && selected === menu}
          contextMenuProps={contextMenuProps}
          items={items[menu]}
        />
      ))}
    </>
  )
}

export { onContextMenu } from './listener'
