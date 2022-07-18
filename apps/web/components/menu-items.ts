import { MenuItem } from 'types'
import store from '@/store/redux'
import { showDebugModal, showUserProfile } from '@/store/modal'
import { removeModuleNode } from '@/store/graph'
import { ModuleStatus } from '@modtree/types'
import { api } from 'api'

const dispatch = store.dispatch

/**
 * floating user button drop-down mneu items
 */
const userDropdownMenu: MenuItem[] = [
  { text: 'Your profile', callback: () => dispatch(showUserProfile()) },
  {
    text: 'Debug',
    callback: () => dispatch(showDebugModal()),
  },
  {
    text: 'Sign out',
    href: '/api/auth/logout',
  },
]

const flowNodeContextMenu: MenuItem[] = [
  {
    text: 'More info',
    callback: (node) => (node ? api.module.openModuleModal(node.id) : null),
  },
  // { text: 'Suggest modules', callback: () => alert('suggest modules') },
  {
    text: 'Mark as done',
    callback: (e) => {
      if (!e) return
      const user = store.getState().user
      api.user.setModuleStatus(
        user.id,
        [...user.modulesDone, e.id],
        ModuleStatus.DONE
      )
    },
  },
  {
    text: 'Mark as doing',
    callback: (e) => {
      if (!e) return
      const user = store.getState().user
      api.user.setModuleStatus(
        user.id,
        [...user.modulesDoing, e.id],
        ModuleStatus.DOING
      )
    },
  },
  {
    text: 'Mark as not done',
    callback: (e) => {
      if (!e) return
      const user = store.getState().user
      api.user.setModuleStatus(user.id, [e.id], ModuleStatus.NOT_TAKEN)
    },
  },
  {
    text: 'Remove',
    callback: async (e) => {
      if (!e) return
      // update graph
      api.graph.toggle(store.getState().graph.id, e.id)
      // remove node from frontend
      store.dispatch(removeModuleNode(e))
    },
  },
]

const flowPaneContextMenu: MenuItem[] = [
  // { text: 'Suggest modules', callback: () => alert('suggest modules') },
  {
    text: 'Coming soon! (try right-clicking a node on the graph)',
    callback: () => false,
  },
]

const getItems = (
  props: Record<string, MenuItem[]>
): Record<string, MenuItem[]> => {
  Object.entries(props).forEach(([menuType, menuItems]) => {
    props[menuType] = menuItems.map((item) => {
      if (!item.callback) {
        return {
          ...item,
          callback: () => console.debug('Menu item has no effect.'),
        }
      }
      return item
    })
  })
  return props
}

export const items = getItems({
  userDropdownMenu,
  flowNodeContextMenu,
  flowPaneContextMenu,
})
