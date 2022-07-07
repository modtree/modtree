import { MenuItem } from 'types'
import store from '@/store/redux'
import { showDebugModal, showUserProfile } from '@/store/modal'

const dispatch = store.dispatch

/**
 * floating user button drop-down mneu items
 */
const userDropdownMenuItems: MenuItem[] = [
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

export const items = {
  userDropdownMenu: userDropdownMenuItems,
}
