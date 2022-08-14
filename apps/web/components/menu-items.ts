import {
  markAsDoing,
  markAsDone,
  markAsPlanned,
  openModuleModal,
  removeModuleNode,
} from '@/store/functions'
import store, { r } from '@/store/redux'
import { devEnv } from '@/utils/env'
import { signOut } from 'next-auth/react'
import { MenuItem } from 'types'

const dispatch = store.dispatch

/**
 * floating user button drop-down mneu items
 */
const userDropdownMenu: MenuItem[] = [
  {
    text: 'Your profile',
    show: true,
    callback: () => dispatch(r.showUserProfile()),
  },
  {
    text: 'Debug',
    show: devEnv,
    callback: () => dispatch(r.showDebugModal()),
  },
  {
    text: 'Sign out',
    show: true,
    callback: () => signOut(),
  },
]

const flowNodeContextMenu: MenuItem[] = [
  /**
   * opens module modal on the current node
   */
  {
    text: 'More info',
    show: true,
    callback: (node) => (node ? openModuleModal(node.data.moduleCode) : null),
  },

  /**
   * mark current node as done
   */
  {
    text: 'Mark as done',
    show: true,
    callback: () => markAsDone(),
  },

  /**
   * mark current node as doing
   */
  {
    text: 'Mark as doing',
    show: true,
    callback: () => markAsDoing(),
  },

  /**
   * mark current node as planned
   * (neither done nor doing)
   */
  {
    text: 'Mark as planned',
    show: true,
    callback: () => markAsPlanned(),
  },

  /**
   * remove current node from the graph
   * TODO: disallow this action if the node is either done/doing
   * to remove a node, it must be in the 'planned' state
   */
  {
    text: 'Remove',
    show: true,
    callback: async (e) => {
      if (!e) return
      // remove node from frontend
      removeModuleNode(e)
    },
  },
]

const flowPaneContextMenu: MenuItem[] = [
  {
    text: 'Coming soon! (try right-clicking a node on the graph)',
    show: true,
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
    (acc, [type, items]) => ({
      ...acc,
      [type]: fillCallback(items.filter((i) => i.show)),
    }),
    {}
  )

export const items = getItems({
  userDropdownMenu,
  flowNodeContextMenu,
  flowPaneContextMenu,
})
