import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import SavedGraphs from './saved-graphs'
import { Tab } from '@headlessui/react'

const SidebarButton = (props: { children: string }) => {
  return <Tab className="text-left">{props.children}</Tab>
}

const Sidebar = () => {
  return (
    <Tab.List className="w-48 bg-blue-100 flex flex-col">
      <SidebarButton>Public profile</SidebarButton>
      <SidebarButton>Account</SidebarButton>
      <SidebarButton>SidebarButton 3</SidebarButton>
    </Tab.List>
  )
}

const Contents = () => {
  return (
    <Tab.Group as="div">
      <div className="bg-green-100 flex flex-row">
        <Sidebar />
        <Tab.Panels>
          <Tab.Panel>Content 1</Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
          <Tab.Panel>Content 3</Tab.Panel>
        </Tab.Panels>
      </div>
    </Tab.Group>
  )
}

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  return (
    <Panel showState={showState} hideAction={hideUserProfile}>
      <Contents />
    </Panel>
  )
}
