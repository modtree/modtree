import { MenuItem } from 'types'
import store from '@/store/redux'
import { showDebugModal, showUserProfile } from '@/store/modal'
import { removeModuleNode } from '@/store/graph'
import { ModuleStatus } from '@modtree/types'
import { api } from 'api'
import { signOut } from 'next-auth/react'
import { devEnv } from '@/utils/env'

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
    callback: () => signOut(),
  },
].filter((item) => {
  const debugList = ['Debug']
  const isDebug = debugList.includes(item.text)
  return devEnv || !isDebug
})

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
    text: 'Mark as planned',
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

const fillCallback = (items: MenuItem[]): MenuItem[] =>
  items.map((item) => ({
    ...item,
    callback: item.callback
      ? item.callback
      : () => console.debug('Menu item has no effect.'),
  }))

type Menus = Record<string, MenuItem[]>

const getItems = (menus: Menus): Menus =>
  Object.entries(menus).reduce(
    (acc, [type, items]) => ({ ...acc, [type]: fillCallback(items) }),
    {}
  )

export const items = getItems({
  userDropdownMenu,
  flowNodeContextMenu,
  flowPaneContextMenu,
})
