export { onContextMenu } from './listener'
import { ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import { ContextMenuContents } from './component'

export function ContextMenu() {
  const { showContextMenu, contextMenuProps } = useSelector<
    ModalState,
    ModalState['modal']
  >((state) => state.modal)

  return showContextMenu ? (
    <div
      id="modtree-context-menu"
      style={contextMenuProps}
      className="absolute z-20"
    >
      <ContextMenuContents />
    </div>
  ) : null
}
