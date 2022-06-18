import { Tab } from '@headlessui/react'
import SidebarButton from './button'

export default function Sidebar() {
  return (
    <Tab.List className="w-48 flex flex-col">
      <SidebarButton>Public profile</SidebarButton>
      <SidebarButton>Account</SidebarButton>
      <SidebarButton>Graphs</SidebarButton>
      <SidebarButton>Degrees</SidebarButton>
    </Tab.List>
  )
}
