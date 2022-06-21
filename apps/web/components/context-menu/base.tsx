import { ContextMenuProps } from '@/store/types'
import { BaseContextMenu, MenuItems } from '@/ui/menu'
import { MenuItem } from 'types'

export function ContextMenu(props: {
  items: MenuItem[]
  contextMenuProps: ContextMenuProps
  show: boolean
}) {
  return props.show ? (
    <div
      id="modtree-context-menu"
      style={props.contextMenuProps}
      className="absolute z-20"
    >
      <BaseContextMenu>
        <MenuItems items={props.items} className="py-1 px-1" roundedSelection />
      </BaseContextMenu>
    </div>
  ) : null
}
