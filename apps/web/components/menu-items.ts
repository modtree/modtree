import { MenuItem } from 'types'
import store from '@/store/redux'
import {
  setModalModule,
  showDebugModal,
  showModuleModal,
  showUserProfile,
} from '@/store/modal'
import { removeModuleNode, setGraph } from '@/store/graph'
import { ModuleStatus } from '@modtree/types'
import { updateUser } from '@/utils/rehydrate'
import { trpc } from '@/utils/trpc'

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
    callback: (e) => {
      if (!e) return
      dispatch(showModuleModal())
      trpc
        .query('module-full', e.id)
        .then((module) => dispatch(setModalModule(module)))
    },
  },
  { text: 'Suggest modules', callback: () => alert('suggest modules') },
  {
    text: 'Mark as done',
    callback: (e) => {
      if (!e) return
      const state = store.getState()
      const userId = state.user.id
      const moduleCodes = [...state.user.modulesDone, e.id]
      trpc
        .mutation('user/set-module-status', {
          userId,
          moduleCodes,
          status: ModuleStatus.DONE,
        })
        .then(() => updateUser())
    },
  },
  {
    text: 'Mark as doing',
    callback: (e) => {
      if (!e) return
      const state = store.getState()
      const userId = state.user.id
      const moduleCodes = [...state.user.modulesDoing, e.id]
      trpc
        .mutation('user/set-module-status', {
          userId,
          moduleCodes,
          status: ModuleStatus.DOING,
        })
        .then(() => updateUser())
    },
  },
  {
    text: 'Remove',
    callback: async (e) => {
      if (!e) return
      // update graph
      const state = store.getState()
      const mainGraph = state.graph
      trpc
        .mutation('graph/toggle', {
          graphId: mainGraph.id,
          moduleCode: e.id,
        })
        .then((g) => {
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
