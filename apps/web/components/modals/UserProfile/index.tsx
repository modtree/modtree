import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import PublicProfile from './public-profile'
import Account from './account'
import Modules from './modules'
import Graphs from './graphs'
import Degrees from './degrees'
import Debug from './debug'
import SidebarWithContents from './sidebar'
import { SidebarCategoryProps } from 'types'
import {
  AcademicCapIcon,
  BeakerIcon,
  CogIcon,
  CubeIcon,
  ShareIcon,
  UserIcon,
} from '@heroicons/react/outline'

const contents: SidebarCategoryProps[] = [
  {
    category: '',
    entries: [
      { title: 'Public profile', content: <PublicProfile />, icon: UserIcon },
      { title: 'Account', content: <Account />, icon: CogIcon },
    ],
  },
  {
    category: 'Academics',
    entries: [
      { title: 'Graphs', content: <Graphs />, icon: ShareIcon },
      { title: 'Modules', content: <Modules />, icon: CubeIcon },
      { title: 'Degrees', content: <Degrees />, icon: AcademicCapIcon },
    ],
  },
  {
    category: 'Developer',
    entries: [{ title: 'Debug', content: <Debug />, icon: BeakerIcon }],
  },
]

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  return (
    <Panel showState={showState} hideAction={hideUserProfile} className="pr-0">
      <SidebarWithContents contents={contents} />
    </Panel>
  )
}
