import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import { Tab } from '@headlessui/react'
import Sidebar from './sidebar'

const Contents = () => {
  return (
    <Tab.Group as="div">
      <div className="flex flex-row space-x-6">
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
