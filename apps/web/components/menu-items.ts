import { MenuItem } from 'types'
import store from '@/store/redux'
import { showDebugModal, showUserProfile } from '@/store/modal'
import { removeModuleNode } from '@/store/graph'
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
  { text: 'Settings', callback: () => alert('open settings') },
  {
    text: 'Sign out',
    href: '/api/auth/logout',
  },
]

const flowNodeContextMenu: MenuItem[] = [
  { text: 'More info', callback: (e) => api.module.openModuleModal(e.id) },
  { text: 'Suggest modules', callback: () => alert('suggest modules') },
  { text: 'Mark as done', callback: () => alert('marked as done') },
  {
    text: 'Remove',
    callback: async (e) => {
      // update graph
      const mainGraph = store.getState().user.mainGraph
      api.graph.toggle(mainGraph.id, e.id)
      // remove node from frontend
      store.dispatch(removeModuleNode(e))
    },
  },
]

const flowPaneContextMenu: MenuItem[] = [
  { text: 'Suggest modules', callback: () => alert('suggest modules') },
  { text: 'Mark as done', callback: () => alert('marked as done') },
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
