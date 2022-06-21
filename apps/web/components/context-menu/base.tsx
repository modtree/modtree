import { useAppSelector } from '@/store/redux'
import { BaseContextMenu, MenuItems } from '@/ui/menu'
import { MenuItem } from 'types'

export function ContextMenu(props: { items: MenuItem[]; show: boolean }) {
  /**
   * all context menus share the same redux state for coordinates
   * since there is only one context menu on the screen at any time.
   */
  const contextMenuProps = useAppSelector(
    (state) => state.modal.contextMenuProps
  )

  return props.show ? (
    <div
      id="modtree-context-menu" // context menus share the same id too
      style={contextMenuProps}
      className="absolute z-20"
    >
      <BaseContextMenu>
        <MenuItems items={props.items} className="py-1 px-1" roundedSelection />
      </BaseContextMenu>
    </div>
  ) : null
}
