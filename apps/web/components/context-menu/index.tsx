import { ContextMenu } from './base'
import { useAppSelector } from '@/store/redux'
import { dashed } from '@/utils/array'
import { items } from '../menu-items'

export function ContextMenus() {
  const { showContextMenu, contextMenuProps } = useAppSelector(
    (state) => state.modal
  )
  const menus = ['flowNodeContextMenu', 'flowPaneContextMenu']
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
