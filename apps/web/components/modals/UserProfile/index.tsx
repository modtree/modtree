import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import { Tab } from '@headlessui/react'

const SidebarButton = (props: { children: string }) => {
  const text = 'text-left text-sm'
  const shape = 'rounded-md'
  const interact = 'hover:bg-gray-100 active:bg-red-200'
  const selectedCss = (s: boolean) =>
    s ? ' font-semibold text-gray-800 bg-gray-100' : ''
  return (
    <Tab
      className={({ selected }) =>
        `px-2 py-1 h-8 ${text} ${shape} ${interact}` + selectedCss(selected)
      }
    >
      {props.children}
    </Tab>
  )
}

const Sidebar = () => {
  return (
    <Tab.List className="w-48 flex flex-col">
      <SidebarButton>Public profile</SidebarButton>
      <SidebarButton>Account</SidebarButton>
      <SidebarButton>Graphs</SidebarButton>
      <SidebarButton>Degrees</SidebarButton>
    </Tab.List>
  )
}

const Contents = () => {
  return (
    <Tab.Group as="div">
      <div className="flex flex-row">
        <Sidebar />
        <Tab.Panels>
          <Tab.Panel>Content 1</Tab.Panel>
          <Tab.Panel>Content 2</Tab.Panel>
          <Tab.Panel>Content 3</Tab.Panel>
          <Tab.Panel>Content 4</Tab.Panel>
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
