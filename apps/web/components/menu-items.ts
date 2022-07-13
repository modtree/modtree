import { MenuItem } from 'types'
import store from '@/store/redux'
import { showDebugModal, showUserProfile } from '@/store/modal'
import { removeModuleNode, setGraph } from '@/store/graph'
import { api } from 'api'
import { ModuleStatus } from '@modtree/types'
import { updateUser } from '@/utils/rehydrate'

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
  {
    text: 'Mark as done',
    callback: (e) => {
      const state = store.getState()
      const userId = state.user.id
      const codes = state.user.modulesDone
      const modules = [...codes, e.id]
      api.user
        .setModuleStatus(userId, modules, ModuleStatus.DONE)
        .then(() => updateUser())
    },
  },
  {
    text: 'Mark as doing',
    callback: (e) => {
      const state = store.getState()
      const userId = state.user.id
      const codes = state.user.modulesDoing
      const modules = [...codes, e.id]
      api.user
        .setModuleStatus(userId, modules, ModuleStatus.DOING)
        .then(() => updateUser())
    },
  },
  {
    text: 'Remove',
    callback: async (e) => {
      // update graph
      const state = store.getState()
      const mainGraph = state.graph
      api.graph.toggle(mainGraph.id, e.id).then((g) => {
        store.dispatch(setGraph(g))
      })
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
